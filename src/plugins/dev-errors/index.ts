import { IPlugin } from '../interfaces';
import * as Hapi from 'hapi';

export default (): IPlugin => {
  return {
    name: 'Dev errors',
    version: '1.0.0',
    register: async (server: Hapi.Server) => {
      const opts = {
        showErrors: process.env.NODE_ENV !== 'production'
      };

      await server.register({
        plugin: require('hapi-dev-errors'),
        options: opts
      });
    }
  };
};
