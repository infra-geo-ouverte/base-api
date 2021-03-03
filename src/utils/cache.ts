import * as md5 from 'md5';
import { inspect } from 'util';
import * as Redis from 'ioredis';

import { Config, IRedisCacheConfig } from '../configurations';
import { Server } from '../core/server';

let redisClient: Redis;
let redisClientReplicats: Redis[] = [];
let loaded = false;
let cacheConfig: IRedisCacheConfig;

function init() {
  loaded = true;
  cacheConfig = Config.getServerConfig().cache;
  const cacheRedisOpts = {
      maxRetriesPerRequest: 3
  };

  redisClient = cacheConfig && cacheConfig.engine === 'redis' ?
    new Redis({}, Object.assign({host: cacheConfig.host, port: cacheConfig.port}, cacheRedisOpts)) : undefined;

  redisClientReplicats = cacheConfig && cacheConfig.engine === 'redis' && cacheConfig.replicats ?
    cacheConfig.replicats
      .filter(r => r.enabled !== false)
      .map(r => new Redis({}, Object.assign({host: r.host, port: r.port}, cacheRedisOpts)))
    : [];
}

function scanRedis(client: Redis, pattern: string, callback: (client: Redis, keys: string[]) => void, cursor = '0') {
  client.scan(cursor, 'MATCH', pattern, 'COUNT', '100', (err: any, reply: [string, string[]]) => {
    if (err) {
      throw err;
    }
    cursor = reply[0];
    const keys = reply[1];
    if (keys.length !== 0) {
      callback(client, keys);
    }
    if (cursor !== '0') {
      scanRedis(client, pattern, deleteKeys, cursor);
    }
  });
}

function deleteKeys(client: Redis, keys: string[]) {
  client.del(keys);
}

function setReplicats(cacheKey: string, value: any, ttl: number) {
  const envelope = {
      item: value,
      stored: Date.now(),
      ttl
  };

  const stringifiedEnvelope = JSON.stringify(envelope);
  const ttlSec = Math.max(1, Math.floor(ttl / 1000));

  for (const client of redisClientReplicats) {
    if (client.status === 'ready') {
      client.set(cacheKey, stringifiedEnvelope);
      client.expire(cacheKey, ttlSec);
    }
  }
}

export function cache({ expiresIn = 86400000, replicats = true } = {}) {
  if (!loaded) {
    init();
  }
  return (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    const targetName = target.constructor.name;
    const cacheServer: any = Server.getServer().cache({
      expiresIn: expiresIn,
      segment: `${targetName}.${propertyKey}`,
      generateFunc: async (request: {
        id: string;
        method: (...args: any[]) => any;
        args: any[];
      }) => {
        const data = await request.method.apply(this, request.args);
        if (replicats && cacheConfig) {
          setReplicats(`${cacheConfig.partition}:${targetName}.${propertyKey}:${request.id}`, data, expiresIn);
        }
        return data;
      },
      generateTimeout: 30000
    });
    return {
      value: function(...args: any[]) {
        const cacheId = md5(inspect(args));
        return cacheServer.get({
          id: cacheId,
          method: descriptor.value.bind(this),
          args
        });
      }
    };
  };
}

export function dropCache(className = '*', functionName = '*', replicats = true) {
  if (!loaded) {
    init();
  }
  return (_target: object, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    return {
      value: (...args: any[]) => {
        const rep = descriptor.value(...args);
        if (cacheConfig.engine === 'redis') {
          const pattern = `${cacheConfig.partition}:${className}.${functionName}:*`;
          scanRedis(redisClient, pattern, deleteKeys);
          if (replicats) {
            for (const client of redisClientReplicats) {
              if (client.status === 'ready') {
                scanRedis(client, pattern, deleteKeys);
              }
            }
          }
        }
        return rep;
      }
    };
  };
}
