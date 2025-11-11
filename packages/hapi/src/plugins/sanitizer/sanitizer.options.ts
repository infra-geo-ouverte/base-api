import { SanitizerOptions } from '@igo2/base-api';
import Joi from 'joi';

export const SanitizerSchema = Joi.object().keys({
  enabled: Joi.boolean().optional(),
  escapeHtmlAttrValue: Joi.boolean().optional()
});

export const defaults: SanitizerOptions = {
  enabled: true,
  escapeHtmlAttrValue: false
};
