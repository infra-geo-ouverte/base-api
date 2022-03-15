import { filterXSS } from 'xss';
import { Readable } from 'stream';

export class Sanitizer {
  static sanitize(obj: any) {
    if (typeof obj === 'object') {
      for (const value in obj) {
        if (obj[value] instanceof Array) {
          for (const object of obj[value]) {
            obj[object] = Sanitizer.sanitize(obj[object]);
          }
        } else if (!(obj[value] instanceof Readable)) {
            obj[value] = JSON.parse(filterXSS(JSON.stringify(obj[value])));
        }
      }
    } else if (typeof obj === 'string') {
      obj = filterXSS(obj);
    }
    return obj;
  }
}
