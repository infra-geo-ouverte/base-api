import { IPlugin } from '../plugin.interface';
import Hapi from '@hapi/hapi';
import HapiDevErrors from 'hapi-dev-errors';

export default (): IPlugin => {
  return {
    name: 'Dev errors',
    version: '1.0.0',
    register: async (server: Hapi.Server) => {
      const opts = {
        showErrors: process.env.NODE_ENV !== 'production'
      };

      await server.register({
        plugin: HapiDevErrors,
        options: opts
      });
    }
  };
};
