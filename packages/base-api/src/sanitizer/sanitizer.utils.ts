import { Readable } from 'stream';
import { escapeAttrValue, filterXSS } from 'xss';

import { SanitizerOptions } from './sanitizer.interface';

export class Sanitizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static sanitize(obj: any, opt: SanitizerOptions) {
    if (typeof obj === 'object') {
      for (const value in obj) {
        if (obj[value] instanceof Array) {
          for (const object of obj[value]) {
            obj[object] = Sanitizer.sanitize(obj[object], opt);
          }
        } else if (!(obj[value] instanceof Readable)) {
          try {
            obj[value] = JSON.parse(
              Sanitizer.sanitizeString(JSON.stringify(obj[value]), opt)
            );
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

  // Source: https://github.com/sindresorhus/escape-string-regexp
  static escapeStringRegex(value: string): string {
    if (typeof value !== 'string') {
      throw new TypeError('Expected a string');
    }

    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  }
}
