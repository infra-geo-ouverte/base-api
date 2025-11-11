import { GeometryObject } from 'geojson';
import Joi from 'joi';

let JoiPlusTemp = Joi.extend((joi: Joi.Root) => ({
  base: joi.array().min(1),
  type: 'stringArray',
  coerce: (value: unknown, _helper: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return { value };
    }
    const delimiter = value.search(';') === -1 ? ',' : ';';
    return { value: value.split(delimiter).map((r) => r.trim()) };
  }
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi.array().items(joi.array().length(2).items(joi.number())),
  type: 'coordinates',
  messages: {
    'coordinates.invalid': '{{#label}} is not a valid coordinate'
  },
  coerce: (value: unknown, helper: Joi.CustomHelpers) => {
    if (Array.isArray(value)) {
      return {
        value: value.map((l: string) => {
          return typeof l === 'string' ? l.split(',') : l;
        })
      };
    }
    if (typeof value === 'string') {
      return { value: value.split(';').map((l) => l.split(',')) };
    }
    return { value, errors: helper.error('coordinates.invalid') };
  }
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi.array().length(4).items(Joi.number()),
  type: 'extent',
  coerce: (value: unknown, _helper: Joi.CustomHelpers) => {
    if (typeof value === 'string') {
      return { value: value.split(',') };
    }
    return { value: value };
  }
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi.object().keys({
    type: joi
      .string()
      .insensitive()
      .valid(
        'Point',
        'LineString',
        'Polygon',
        'MultiPoint',
        'MultiLineString',
        'MultiPolygon'
      )
      .required(),
    coordinates: joi
      .array()
      .required()
      .items(
        joi.number(),
        joi
          .array()
          .items(
            Joi.number(),
            joi.array().items(joi.number(), joi.array().items(joi.number()))
          )
      ),
    crs: joi
      .object()
      .optional()
      .keys({
        type: joi.string().valid('name'),
        properties: joi.object().keys({
          name: joi.string().regex(/EPSG:[0-9]+/, 'EPSG')
        })
      })
  }),
  type: 'geojson',
  messages: {
    'geojson.invalid': '{{#label}} is not a valid geojson'
  },
  coerce: (value: unknown, helper: Joi.CustomHelpers) => {
    let geojson: GeometryObject;
    try {
      if (typeof value === 'string') {
        geojson = JSON.parse(value);
        return { value: geojson };
      }
    } catch {
      return { value, errors: helper.error('geojson.invalid') };
    }
  }
}));

export const JoiPlus = JoiPlusTemp;
