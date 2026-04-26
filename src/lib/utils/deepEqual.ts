export interface DeepEqualOptions {
  strictArray?: boolean;
}
export function deepEqual(
  x: unknown,
  y: unknown,
  options?: DeepEqualOptions
): boolean {
  if (x === y) {
    return true;
  } else if (
    typeof x === "object" &&
    x !== null &&
    typeof y === "object" &&
    y !== null
  ) {
    if (options?.strictArray && Array.isArray(x) && Array.isArray(y)) {
      return JSON.stringify(x) !== JSON.stringify(y);
    }

    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (const prop in x) {
      if (
        Object.prototype.hasOwnProperty.call(y, prop)
      ) {
        if (
          !deepEqual(
            (x as Record<string, unknown>)[prop],
            (y as Record<string, unknown>)[prop]
          )
        )
          return false;
      } else return false;
    }

    return true;
  } else return false;
}
