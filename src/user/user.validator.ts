import * as Joi from 'joi';
import * as Boom from '@hapi/boom';

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

  static authenticateValidator(value: object, _options?: Joi.ValidationOptions) {
    const valid = UserValidator.notAnonymousValidator.validate(value);
    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }
  }

  static async adminValidator(value: object, _options?: Joi.ValidationOptions) {
    const valid = UserValidator.notAnonymousValidator.validate(value);
    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }

    const profils = value['x-consumer-groups'];
    if (!profils || !profils.split(', ').includes('admin')) {
      throw Boom.forbidden('Must be administrator');
    }
  }

  static groupValidator(value: object, _options?: Joi.ValidationOptions, groups = []) {
    const valid = UserValidator.notAnonymousValidator.validate(value);

    if (valid.error) {
      throw Boom.unauthorized('Must be authenticated');
    }

    const profilsStr = value['x-consumer-groups'] || '';
    const profils = profilsStr.split(', ');
    if (!profils.some((p: string) => groups.includes(p))) {
      throw Boom.forbidden("You don't have permissions");
    }
  }
}
