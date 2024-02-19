import Joi from 'joi';
import { SanitizerOptions } from '../../utils/sanitizer/sanitizer.interface';

export const SanitizerSchema = Joi.object().keys({
  enabled: Joi.boolean().optional(),
  escapeHtmlAttrValue: Joi.boolean().optional()
});

export const defaults: SanitizerOptions = {
  enabled: true,
  escapeHtmlAttrValue: false
};
