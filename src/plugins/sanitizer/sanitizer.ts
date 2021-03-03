import { filterXSS } from 'xss';
import { Readable } from 'stream';

export class Sanitizer {
  static sanitize(obj: any) {
    for (const value in obj) {
      if (!(obj[value] instanceof Readable)) {
        obj[value] = JSON.parse(filterXSS(JSON.stringify(obj[value])));
      }
    }
    return obj;
  }
}
