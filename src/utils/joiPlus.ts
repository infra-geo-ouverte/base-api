import * as Joi from 'joi';
import { GeometryObject } from 'geojson';

let JoiPlusTemp = Joi.extend((joi: Joi.Root) => ({
  base: joi.array().min(1),
  type: 'stringArray',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return { value };
    }
    const delimiter = value.search(';') === -1 ? ',' : ';';
    return { value: value.split(delimiter).map((r) => r.trim()) };
  },
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi.array().items(joi.array().length(2).items(joi.number())),
  type: 'coordinates',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return { value: value.map((l: string) => l.split(',')) };
    }
    return { value: value.split(';').map((l) => l.split(',')) };
  },
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi
    .array()
    .length(4)
    .items(Joi.number()),
  type: 'extent',
  coerce: (value: any, _helper: Joi.CustomHelpers) => {
    return { value: value.split(',') };
  }
}));

JoiPlusTemp = JoiPlusTemp.extend((joi: Joi.Root) => ({
  base: joi.object().keys({
    type: joi.string()
      .insensitive()
      .valid('Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon')
      .required(),
    coordinates: joi.array()
      .required()
      .items(
        joi.number(),
        joi.array().items(Joi.number(), joi.array().items(joi.number(), joi.array().items(joi.number()))),
      ),
    crs: joi.object()
      .optional()
      .keys({
        type: joi.string().valid('name'),
        properties: joi.object().keys({
          name: joi.string().regex(/EPSG:[0-9]+/, 'EPSG'),
        }),
      }),
  }),
  type: 'geojson',
  messages: {
    'geojson.invalid': '{{#label}} is not a valid geojson'
  },
  coerce: (value: any, helper: Joi.CustomHelpers) => {
    let geojson: GeometryObject;
    try {
      geojson = JSON.parse(value);
    } catch (e) {
      return { value, errors: helper.error('geojson.invalid') };
    }
    return { value: geojson };
  },
}));

export const JoiPlus = JoiPlusTemp;
