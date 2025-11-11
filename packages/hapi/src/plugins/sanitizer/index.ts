import Hapi from '@hapi/hapi';
import { Sanitizer, SanitizerOptions } from '@igo2/base-api';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { SanitizerSchema, defaults } from './sanitizer.options';

export default (): IPlugin => {
  return {
    name: 'Sanitizer',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const result = SanitizerSchema.validate(options.sanitizer);
      const sanitizerDefaultOpt: SanitizerOptions = Object.assign(
        {},
        defaults,
        result.value
      );

      if (result.error) {
        throw result.error;
      }

      server.ext(
        'onPostAuth',
        (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const sanitizerOpt: SanitizerOptions = Object.assign(
            {},
            sanitizerDefaultOpt,
            (request.route.settings.plugins as Record<string, unknown>).sanitize
          );

          if (!sanitizerOpt.enabled) {
            return h.continue;
          }

          if (
            request.payload ||
            Object.keys(request.params).length ||
            Object.keys(request.query).length
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (request as any).payload = Sanitizer.sanitize(
              request.payload,
              sanitizerOpt
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (request as any).query = Sanitizer.sanitize(
              request.query,
              sanitizerOpt
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (request as any).params = Sanitizer.sanitize(
              request.params,
              sanitizerOpt
            );
          }

          return h.continue;
        }
      );
    }
  };
};
