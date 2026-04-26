/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect, mock } from "bun:test";

let capturedState: unknown;

mock.module("react", () => ({
  useRef: <T,>(value: T) => ({ current: value }),
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useMemo: <T,>(fn: () => T) => fn(),
  useState: (init: unknown) => {
    let value = typeof init === "function" ? (init as () => unknown)() : init;
    capturedState = value;
    const setValue = (next: unknown) => {
      value = typeof next === "function" ? (next as (prev: unknown) => unknown)(value) : next;
      capturedState = value;
    };
    return [value, setValue];
  },
  useEffect: (fn: () => void | (() => void)) => {
    fn();
  },
}));

describe("useValue module", () => {
  test("should export useValue function", () => {
    const mod = require("../useValue");
    expect(typeof mod.useValue).toBe("function");
  });

  test("useValue should be callable", () => {
    const mod = require("../useValue");
    expect(mod.useValue).toBeDefined();
  });

  test("useValue export should be accessible", () => {
    const mod = require("../useValue");
    expect(mod).toBeDefined();
    expect(Object.keys(mod).includes("useValue")).toBe(true);
  });

  test("should return default key value when observeValue is not provided", () => {
    const { useValue } = require("../useValue");

    const subscribers: Array<(value: unknown) => void> = [];
    const stateObserver = {
      getDefaultValue: (key: string) => ({ count: 1, name: "john" }[key]),
      subscribe: (_key: string, cb: (value: unknown) => void) => {
        subscribers.push(cb);
        return () => {};
      },
    };

    const result = useValue({ key: "count", stateObserver });
    expect(result.value).toBe(1);

    subscribers[0]?.(5);
    expect(capturedState).toBe(5);
  });

  test("should map value using observeValue", () => {
    const { useValue } = require("../useValue");

    const subscribers: Array<(value: unknown) => void> = [];
    const stateObserver = {
      getDefaultValue: () => ({ first: "john", last: "doe" }),
      subscribe: (_key: string, cb: (value: unknown) => void) => {
        subscribers.push(cb);
        return () => {};
      },
    };

    const result = useValue({
      key: "user",
      stateObserver,
      observeValue: (user: { first: string; last: string }) => `${user.first} ${user.last}`,
    });

    expect(result.value).toBe("john doe");

    subscribers[0]?.({ first: "jane", last: "smith" });
    expect(capturedState).toBe("jane smith");
  });

  test("should keep previous state when deepEqual returns true", () => {
    const { useValue } = require("../useValue");

    const subscribers: Array<(value: unknown) => void> = [];
    const stateObserver = {
      getDefaultValue: () => ({ count: 1 }),
      subscribe: (_key: string, cb: (value: unknown) => void) => {
        subscribers.push(cb);
        return () => {};
      },
    };

    useValue({
      key: "value",
      stateObserver,
      observeValue: (v: { count: number }) => v.count,
      deepEqual: () => true,
    });

    const before = capturedState;
    subscribers[0]?.({ count: 2 });
    expect(capturedState).toBe(before);
  });

  test("should set defaultValue when provided", () => {
    const { useValue } = require("../useValue");

    const stateObserver = {
      getDefaultValue: () => "ignored",
      subscribe: () => () => {},
    };

    const result = useValue({ key: "name", stateObserver, defaultValue: "fallback" });
    expect(result.value).toBe("fallback");
  });
});
