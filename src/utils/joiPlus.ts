import * as Joi from 'joi';
import * as Boom from '@hapi/boom';

let JoiPlus = Joi.extend((joi: Joi.Root) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return { value };
    }
    const delimiter = value.search(';') === -1 ? ',' : ';';
    return { value: value.split(delimiter).map((r) => r.trim()) };
  },
}));

JoiPlus = JoiPlus.extend((joi: Joi.Root) => ({
  base: joi.array().items(joi.array().length(2).items(Joi.number())),
  type: 'coordinates',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return { value: value.map((l: string) => l.split(',')) };
    }
    return { value: value.split(';').map((l) => l.split(',')) };
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
      .items(
        Joi.number(),
        Joi.array().items(Joi.number(), Joi.array().items(Joi.number(), Joi.array().items(Joi.number()))),
      ),
    crs: Joi.object()
      .optional()
      .keys({
        type: Joi.string().valid('name'),
        properties: Joi.object().keys({
          name: Joi.string().regex(/EPSG:[0-9]+/, 'EPSG'),
        }),
      }),
  }),
  type: 'geojson',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    let geojson: any;
    try {
      geojson = JSON.parse(JSON.stringify(value));
    } catch (e) {
      throw Boom.badRequest('Geojson is invalid');
    }
    return { value: geojson };
  },
}));
