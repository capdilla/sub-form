/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect } from "bun:test";

describe("deepEqual advanced edge cases", () => {
  test("should handle objects with many keys", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
    const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };

    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle objects with same keys but different order", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { c: 3, a: 1, b: 2 };

    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle arrays with objects in different order", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const arr1 = [{ id: 1 }, { id: 2 }];
    const arr2 = [{ id: 2 }, { id: 1 }];

    expect(deepEqual(arr1, arr2)).toBe(false);
  });

  test("should handle strings vs string objects", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stringObj: any = new String("hello");
    expect(deepEqual("hello", stringObj)).toBe(false);
  });

  test("should handle numbers with decimal places", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual({ value: 3.14 }, { value: 3.14 })).toBe(true);
    expect(deepEqual({ value: 3.14 }, { value: 3.15 })).toBe(false);
  });

  test("should handle negative numbers", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual({ value: -10 }, { value: -10 })).toBe(true);
    expect(deepEqual({ value: -10 }, { value: 10 })).toBe(false);
  });

  test("should handle mixed array with null and undefined", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual([1, null, "test"], [1, null, "test"])).toBe(true);
    expect(deepEqual([1, null, "test"], [1, undefined, "test"])).toBe(false);
  });

  test("should handle objects with only undefined values", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj1: any = { a: undefined };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj2: any = { a: undefined };

    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle objects with function values", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const fn1 = () => {};
    const fn2 = () => {};

    expect(deepEqual({ fn: fn1 }, { fn: fn2 })).toBe(false);
    expect(deepEqual({ fn: fn1 }, { fn: fn1 })).toBe(true);
  });

  test("should handle empty string values", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual({ msg: "" }, { msg: "" })).toBe(true);
    expect(deepEqual({ msg: "" }, { msg: " " })).toBe(false);
  });

  test("should handle arrays with undefined", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual([1, undefined, 3], [1, undefined, 3])).toBe(true);
    expect(deepEqual([1, undefined, 3], [1, 2, 3])).toBe(false);
  });

  test("should handle very large objects", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const obj1: { [key: string]: number } = {};
    const obj2: { [key: string]: number } = {};

    for (let i = 0; i < 100; i++) {
      obj1[`key_${i}`] = i;
      obj2[`key_${i}`] = i;
    }

    expect(deepEqual(obj1, obj2)).toBe(true);

    obj2.key_50 = 999;
    expect(deepEqual(obj1, obj2)).toBe(false);
  });

  test("should handle objects with symbol keys", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    // Note: Object.keys() doesn't include symbols, so these are treated as equivalent
    const sym = Symbol("test");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj1: any = { a: 1 };
    obj1[sym] = "value";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj2: any = { a: 1 };

    expect(deepEqual(obj1, obj2)).toBe(true); // Symbols not checked
  });

  test("should handle NaN comparison", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    // NaN === NaN is false in JavaScript
    expect(deepEqual({ value: NaN }, { value: NaN })).toBe(false);
  });

  test("should handle Infinity", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    expect(deepEqual({ value: Infinity }, { value: Infinity })).toBe(true);
    expect(deepEqual({ value: -Infinity }, { value: -Infinity })).toBe(true);
    expect(deepEqual({ value: Infinity }, { value: -Infinity })).toBe(false);
  });

  test("should handle boolean objects vs primitives", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boolObj: any = new Boolean(true);
    expect(deepEqual(true, boolObj)).toBe(false);
  });

  test("should handle date objects comparison", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const date1 = new Date("2024-01-01");
    const date2 = new Date("2024-01-01");

    // Current implementation treats Date objects with same enumerable keys as equal
    expect(deepEqual(date1, date2)).toBe(true);
    expect(deepEqual(date1, date1)).toBe(true);
  });

  test("should handle RegExp objects", () => {
    const deepEqual = require("../deepEqual").deepEqual;

    const regex1 = /test/g;
    const regex2 = /test/g;

    // Current implementation treats RegExp objects with same enumerable keys as equal
    expect(deepEqual(regex1, regex2)).toBe(true);
    expect(deepEqual(regex1, regex1)).toBe(true);
  });
});
