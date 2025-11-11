import Boom from '@hapi/boom';
import Joi from 'joi';

export class UserValidator {
  static userValidator = Joi.object({
    'x-consumer-id': Joi.string().required(),
    'x-consumer-username': Joi.string().required(),
    'x-consumer-groups': Joi.string().allow('')
  }).unknown();

  static notAnonymousValidator = UserValidator.userValidator.concat(
    Joi.object({
      'x-anonymous-consumer': Joi.boolean().forbidden()
    }).unknown()
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static authenticateValidator(value: any, _options?: Joi.ValidationOptions) {
    const valid = UserValidator.notAnonymousValidator.validate(value);
    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async adminValidator(value: any, _options?: Joi.ValidationOptions) {
    const valid = UserValidator.notAnonymousValidator.validate(value);
    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }

    const profils = value['x-consumer-groups'];
    if (!profils || !profils.split(', ').includes('admin')) {
      throw Boom.forbidden('Must be administrator');
    }
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  static groupValidator(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    _options?: Joi.ValidationOptions,
    groups: string[] = []
  ) {
    const valid = UserValidator.notAnonymousValidator.validate(value);

    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }

    const profilsStr = value['x-consumer-groups'] || '';
    const profils = profilsStr.split(', ');
    if (!profils.some((p: string) => groups.includes(p))) {
      throw Boom.forbidden("You don't have permissions");
    }
    return new Promise((resolve) => {
      resolve(value);
    });
  }
}
