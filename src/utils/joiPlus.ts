import * as Joi from 'joi';
import * as Boom from 'boom';
import { GeometryObject } from 'geojson';

let JoiPlus = Joi.extend((joi: Joi.Root) => ({
  base: joi.array(),
  name: 'stringArray',
  coerce: (value: any, _state: Joi.State, _options: Joi.ObjectSchema) => {
    if (typeof value !== 'string') {
      return value;
    }
    const delimiter = value.search(';') === -1 ? ',' : ';';
    return value.split(delimiter).map((r) => r.trim());
  },
}));

JoiPlus = JoiPlus.extend((joi: Joi.Root) => ({
  base: joi.array().items(joi.array().length(2).items(Joi.number())),
  name: 'coordinates',
  coerce: (value: any, _state: Joi.State, _options: Joi.ObjectSchema) => {
    if (typeof value !== 'string') {
      return value.map((l: string) => l.split(','));
    }
    return value.split(';').map((l) => l.split(','));
  },
}));

JoiPlus = JoiPlus.extend((joi: Joi.Root) => ({
  base: joi.object().keys({
    type: Joi.string()
      .insensitive()
      .valid('Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon')
      .required(),
    coordinates: Joi.array()
      .required()
      .items([
        Joi.number(),
        Joi.array().items(Joi.number(), Joi.array().items(Joi.number(), Joi.array().items(Joi.number()))),
      ]),
    crs: Joi.object()
      .optional()
      .keys({
        type: Joi.string().valid('name'),
        properties: Joi.object().keys({
          name: Joi.string().regex(/EPSG:[0-9]+/, 'EPSG'),
        }),
      }),
  }),
  name: 'geojson',
  coerce: (value: any, _state: Joi.State, _options: Joi.ObjectSchema) => {
    let geojson: GeometryObject;
    try {
      geojson = JSON.parse(JSON.stringify(value));
    } catch (e) {
      throw Boom.badRequest('Geojson is invalid');
    }
    return geojson;
  },
}));

export { JoiPlus };
