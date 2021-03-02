import { filterXSS } from 'xss';

export class Sanitizer {
  static sanitize(obj: any) {
    return JSON.parse(filterXSS(JSON.stringify(obj)));
  }
}
