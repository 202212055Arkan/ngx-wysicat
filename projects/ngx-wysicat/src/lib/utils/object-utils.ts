export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? T[K] // arrays are replaced, not merged
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function isPlainObject(value: any): value is object {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  const result: any = { ...base };
  for (const key in override) {
    if (override[key] !== undefined) {
      if (
        isPlainObject(base[key]) &&
        isPlainObject(override[key])
      ) {
        result[key] = deepMerge(base[key], override[key] as any);
      } else {
        result[key] = override[key];
      }
    }
  }
  return result;
}
