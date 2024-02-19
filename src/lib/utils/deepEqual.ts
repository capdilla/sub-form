export interface DeepEqualOptions {
  strictArray?: boolean;
}
export function deepEqual(x: any, y: any, options?: DeepEqualOptions): boolean {
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
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}
