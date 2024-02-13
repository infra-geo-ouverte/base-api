import fs from 'fs';
import Handlebars from 'handlebars';

export function registerPartialTemplate(path: string) {
  fs.readdirSync(path)
    .filter(file => {
      return file.match(/.*.html/);
    })
    .forEach(file => {
      Handlebars.registerPartial(
        file.split('.')[0],
        fs.readFileSync(`${path}${file}`, 'utf8')
      );
    });
}
