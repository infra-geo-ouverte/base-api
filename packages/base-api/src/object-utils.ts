/* eslint-disable @typescript-eslint/no-explicit-any */
export class ObjectUtils {
  static resolve(obj: object, key: string): unknown {
    const keysArray = key.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    let current = obj;
    while (keysArray.length) {
      if (typeof current !== 'object') {
        return undefined;
      }
      const nextKey = keysArray.shift();
      if (nextKey === undefined) {
        return undefined;
      }
      current = (current as any)[nextKey];
    }

    return current;
  }

  static isObject(item: object) {
    return (
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      item !== null &&
      !(item instanceof Date)
    );
  }

  static mergeDeep(target: any, source: any, ignoreUndefined = false): unknown {
    const output = Object.assign({}, target) as any;
    if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
      Object.keys(source)
        .filter((key) => !ignoreUndefined || source[key] !== undefined)
        .forEach((key) => {
          if (ObjectUtils.isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = ObjectUtils.mergeDeep(
                target[key],
                source[key],
                ignoreUndefined
              );
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
    }
    return output;
  }

  static removeUndefined(obj: any): unknown {
    const output: any = {};
    if (ObjectUtils.isObject(obj)) {
      Object.keys(obj)
        .filter((key) => obj[key] !== undefined)
        .forEach((key) => {
          if (ObjectUtils.isObject(obj[key]) || Array.isArray(obj[key])) {
            output[key] = ObjectUtils.removeUndefined(obj[key]);
          } else {
            output[key] = obj[key];
          }
        });

      return output;
    }

    if (Array.isArray(obj)) {
      return obj.map((o) => ObjectUtils.removeUndefined(o));
    }

    return obj;
  }

  static removeNull<T extends object>(obj: T): T {
    const output: any = {};
    if (ObjectUtils.isObject(obj)) {
      Object.keys(obj)
        .filter((key) => (obj as any)[key] !== null)
        .forEach((key) => {
          if (
            ObjectUtils.isObject((obj as any)[key]) ||
            Array.isArray((obj as any)[key])
          ) {
            output[key] = ObjectUtils.removeNull((obj as any)[key]);
          } else {
            output[key] = (obj as any)[key];
          }
        });

      return output as T;
    } else if (Array.isArray(obj)) {
      return (obj as any).map((o: any) => ObjectUtils.removeNull(o)) as T;
    }

    return obj;
  }
}
