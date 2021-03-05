import * as Hapi from '@hapi/hapi';
import { IPlugin, IPluginOptions } from '../plugin.interface';
import { Config } from '../../configurations';
import { SwaggerSchema, SwaggerOptions } from './swagger.options';

export default (): IPlugin => {
  return {
    name: 'Swagger Documentation',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const result = SwaggerSchema.validate(options.swagger);
      const pck = require(`${Config.getBasePath()}/../package.json`);
      const swaggerOptions: SwaggerOptions = Object.assign(
        {
          jsonPath: (options?.global?.baseHref || '') + '/swagger.json',
          documentationPath: (options?.global?.baseHref || '') + '/docs/api',
          swaggerUIPath: (options?.global?.baseHref || '') + '/swaggerui/',
          info: {
              title: pck.name + " API Documentation",
              version: pck.version,
              description: pck.description
          }
        },
        result.value
      );

      if (result.error) {
        throw result.error;
      }

      await server.register([
        require('@hapi/inert'),
        require('@hapi/vision'),
        {
          plugin: require('hapi-swagger'),
          options: swaggerOptions
        }
      ]);
    }
  };
};
