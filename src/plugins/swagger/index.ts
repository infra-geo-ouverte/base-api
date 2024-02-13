import Hapi from '@hapi/hapi';
import { IPlugin, IPluginOptions } from '../plugin.interface';
import { Config } from '../../configurations';
import { SwaggerSchema, SwaggerOptions } from './swagger.options';
import HapiInert from '@hapi/inert';
import HapiVision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

export default (): IPlugin => {
  return {
    name: 'Swagger Documentation',
    version: '1.0.1',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const serverHref = Config.getServerConfig().baseHref || '';
      const apiHref = (options?.global?.baseHref || '');
      const result = SwaggerSchema.validate(options.swagger);
      const pck = await import(`${Config.getBasePath()}/../package.json`);
      const swaggerOptions: SwaggerOptions = Object.assign(
        {
          basePath: '/',
          jsonRoutePath: apiHref + '/swagger.json',
          routesBasePath: apiHref + '/swaggerui/',
          documentationPath: apiHref + '/docs/api',
          jsonPath: serverHref + apiHref + '/swagger.json',
          swaggerUIPath: serverHref + apiHref + '/swaggerui/',
          info: {
              title: pck.name + ' API Documentation',
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
        HapiInert,
        HapiVision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
      ]);
    }
  };
};
