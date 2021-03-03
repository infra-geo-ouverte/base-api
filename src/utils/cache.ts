import * as md5 from 'md5';
import { inspect } from 'util';

import { Server } from '../core/server';

export function cache({ expiresIn = 86400000 } = {}) {
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
        return await request.method.apply(this, request.args);
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
