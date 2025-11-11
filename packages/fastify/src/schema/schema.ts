import { TSchema, Type } from 'typebox';

export const ObjectKeyValueType = Type.Object({
  value: Type.String(),
  value_name: Type.String()
});

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

export const OptionalNullable = <T extends TSchema>(schema: T) =>
  Type.Optional(Nullable(schema));

export const UnionLiteral = <T extends string>(array: readonly T[]) =>
  Type.Union(array.map((value) => Type.Literal(value)));

export const StringArray = <T extends string = string>(
  options?: Type.TStringOptions
) =>
  Type.Codec(Type.String(options))
    .Decode((value: string) => value.split(',').map((s) => s.trim() as T))
    .Encode((value: T[]) => value.join(',') as T);
