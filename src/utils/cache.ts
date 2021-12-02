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

async function scanRedis(
  client: Redis, pattern: string, callback: (client: Redis, keys: string[]) => Promise<void>, cursor = '0'
) {
  return new Promise((resolve, _reject) => {
    client.scan(cursor, 'MATCH', pattern, 'COUNT', '100', async (err: any, reply: [string, string[]]) => {
      if (err) {
        throw err;
      }
      cursor = reply[0];
      const keys = reply[1];

      if (cursor !== '0') {
        await scanRedis(client, pattern, deleteKeys, cursor);
      }

      if (keys.length !== 0) {
        await callback(client, keys);
        resolve(0);
      } else {
        resolve(0);
      }
    });
  });
}

async function deleteKeys(client: Redis, keys: string[]) {
  await client.pipeline().del(keys).exec();
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
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      if (cacheConfig && cacheConfig.engine === 'redis') {
        const pattern = `${cacheConfig.partition}:${className}.${functionName}:*`;
        await scanRedis(redisClient, pattern, deleteKeys);
        if (replicats) {
          for (const client of redisClientReplicats) {
            if (client.status === 'ready') {
              await scanRedis(client, pattern, deleteKeys);
            }
          }
        }
      }

      return await originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
