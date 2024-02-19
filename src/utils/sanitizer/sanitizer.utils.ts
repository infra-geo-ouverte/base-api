import { filterXSS, escapeAttrValue } from 'xss';
import { Readable } from 'stream';
import { SanitizerOptions } from './sanitizer.interface';

export class Sanitizer {
  static sanitize(obj: unknown, opt: SanitizerOptions) {
    if (typeof obj === 'object') {
      for (const value in obj) {
        if (obj[value] instanceof Array) {
          for (const object of obj[value]) {
            obj[object] = Sanitizer.sanitize(obj[object], opt);
          }
        } else if (!(obj[value] instanceof Readable)) {
          try {
            obj[value] = JSON.parse(Sanitizer.sanitizeString(JSON.stringify(obj[value]), opt));
          } catch {
            obj[value] = Sanitizer.sanitizeString(obj[value], opt);
          }
        }
      }
    } else if (typeof obj === 'string') {
      obj = Sanitizer.sanitizeString(obj, opt);
    }
    return obj;
  }

  static sanitizeString(string: string, opt?: SanitizerOptions) {
    let stringSanitized = filterXSS(string);

    if (opt?.escapeHtmlAttrValue) {
      stringSanitized = escapeAttrValue(stringSanitized);
    }

    return stringSanitized;
  }
}
