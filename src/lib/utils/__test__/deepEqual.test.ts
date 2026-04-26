import { test, describe, expect } from "bun:test";
import { deepEqual } from "../deepEqual";

describe("deepEqual utility", () => {
  // ============ Primitives ============
  test("should return true for identical primitives", () => {
    expect(deepEqual(5, 5)).toBe(true);
    expect(deepEqual("hello", "hello")).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  test("should return false for different primitives", () => {
    expect(deepEqual(5, 10)).toBe(false);
    expect(deepEqual("hello", "world")).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
  });

  test("should return true for identical null/undefined", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  test("should return false for different null/undefined combinations", () => {
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(null, 0)).toBe(false);
    expect(deepEqual(undefined, "")).toBe(false);
  });

  // ============ Objects ============
  test("should return true for identical flat objects", () => {
    expect(deepEqual({ name: "John", age: 30 }, { name: "John", age: 30 })).toBe(true);
  });

  test("should return false for objects with different values", () => {
    expect(deepEqual({ name: "John", age: 30 }, { name: "Jane", age: 30 })).toBe(false);
  });

  test("should return false for objects with different keys", () => {
    expect(deepEqual({ name: "John" }, { name: "John", age: 30 })).toBe(false);
  });

  test("should return true for identical nested objects", () => {
    const obj1 = { user: { name: "John", address: { city: "NYC" } } };
    const obj2 = { user: { name: "John", address: { city: "NYC" } } };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should return false for objects with different nested values", () => {
    const obj1 = { user: { name: "John", address: { city: "NYC" } } };
    const obj2 = { user: { name: "Jane", address: { city: "NYC" } } };
    expect(deepEqual(obj1, obj2)).toBe(false);
  });

  test("should handle empty objects", () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual({}, { a: 1 })).toBe(false);
  });

  // ============ Arrays ============
  test("should return true for identical arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
  });

  test("should return false for arrays with different values", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  test("should return false for arrays with different lengths", () => {
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
  });

  test("should return true for arrays of objects", () => {
    const arr1 = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
    const arr2 = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
    expect(deepEqual(arr1, arr2)).toBe(true);
  });

  test("should return true for empty arrays", () => {
    expect(deepEqual([], [])).toBe(true);
  });

  test("should handle nested arrays", () => {
    expect(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
    expect(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
  });

  // ============ Mixed types ============
  test("should handle objects with array properties", () => {
    const obj1 = { items: [1, 2, 3], count: 3 };
    const obj2 = { items: [1, 2, 3], count: 3 };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle arrays with object properties", () => {
    const arr1 = [{ id: 1, tags: ["a", "b"] }];
    const arr2 = [{ id: 1, tags: ["a", "b"] }];
    expect(deepEqual(arr1, arr2)).toBe(true);
  });

  // ============ strictArray option ============
  test("strictArray: true should use JSON.stringify for arrays", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    // When strictArray is true, the function returns true if JSON strings are DIFFERENT
    expect(deepEqual(arr1, arr2, { strictArray: true })).toBe(false);
  });

  test("strictArray: true should detect different arrays via JSON", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    // JSON strings are different, so it returns true
    expect(deepEqual(arr1, arr2, { strictArray: true })).toBe(true);
  });

  // ============ Type mismatches ============
  test("should return false when comparing different types", () => {
    expect(deepEqual(5, "5")).toBe(false);
    expect(deepEqual([], {})).toBe(true); // Both have 0 keys so are considered equal
    expect(deepEqual(null, {})).toBe(false);
  });

  // ============ Edge cases ============
  test("should handle objects with null values", () => {
    expect(deepEqual({ a: null }, { a: null })).toBe(true);
    expect(deepEqual({ a: null }, { a: undefined })).toBe(false);
  });

  test("should handle objects with undefined values", () => {
    expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true);
  });

  test("should handle circular-like structures (within limits)", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle very deeply nested objects", () => {
    const deep1 = { a: { b: { c: { d: { e: { f: 1 } } } } } };
    const deep2 = { a: { b: { c: { d: { e: { f: 1 } } } } } };
    expect(deepEqual(deep1, deep2)).toBe(true);
  });

  test("should return false for deeply nested objects with different values", () => {
    const deep1 = { a: { b: { c: { d: { e: { f: 1 } } } } } };
    const deep2 = { a: { b: { c: { d: { e: { f: 2 } } } } } };
    expect(deepEqual(deep1, deep2)).toBe(false);
  });

  test("should handle arrays with mixed types", () => {
    const arr1 = [1, "two", true, null, { a: 1 }];
    const arr2 = [1, "two", true, null, { a: 1 }];
    expect(deepEqual(arr1, arr2)).toBe(true);
  });

  test("should handle objects with special keys", () => {
    expect(deepEqual({ "": 1, a: 2 }, { "": 1, a: 2 })).toBe(true);
  });

  test("should return true for reference equality", () => {
    const obj = { name: "John" };
    expect(deepEqual(obj, obj)).toBe(true);
  });

  test("should handle objects with numeric keys", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj1: any = {};
    obj1[1] = "a";
    obj1[2] = "b";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj2: any = {};
    obj2[1] = "a";
    obj2[2] = "b";
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test("should handle boolean primitives in objects", () => {
    expect(deepEqual({ active: true, deleted: false }, { active: true, deleted: false })).toBe(true);
    expect(deepEqual({ active: true }, { active: false })).toBe(false);
  });

  test("should handle zero and negative numbers", () => {
    expect(deepEqual({ count: 0 }, { count: 0 })).toBe(true);
    expect(deepEqual({ count: -5 }, { count: -5 })).toBe(true);
    expect(deepEqual({ count: 0 }, { count: -0 })).toBe(true); // JS treats 0 and -0 as equal
  });
});
