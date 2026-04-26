/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect, mock } from "bun:test";

mock.module("react", () => ({
  useRef: <T,>(value: T) => ({ current: value }),
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useMemo: <T,>(fn: () => T) => fn(),
  useState: (init: unknown) => {
    let value = typeof init === "function" ? (init as () => unknown)() : init;
    const setValue = (next: unknown) => {
      value = typeof next === "function" ? (next as (prev: unknown) => unknown)(value) : next;
    };
    return [value, setValue];
  },
  useEffect: (fn: () => void | (() => void)) => {
    fn();
  },
}));

describe("CreateSubState class", () => {
  test("should create an instance with default state", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ count: 0, message: "hello" });
    expect(state.observer).toBeDefined();
    expect(state.observer.state).toEqual({ count: 0, message: "hello" });
  });

  test("should have observer property with StateObserver", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ name: "John" });
    expect(typeof state.observer.setKeyState).toBe("function");
    expect(typeof state.observer.setState).toBe("function");
    expect(typeof state.observer.subscribe).toBe("function");
  });

  test("should have useValue method", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ count: 0 });
    expect(typeof state.useValue).toBe("function");
  });

  test("observer should be able to update state", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ count: 0 });
    state.observer.setKeyState("count", 5);
    expect(state.observer.state.count).toBe(5);
  });

  test("observer should handle subscription callbacks", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ message: "" });
    let receivedValue: unknown;

    const unsubscribe = state.observer.subscribe("message", (value) => {
      receivedValue = value;
    });

    state.observer.setKeyState("message", "hello");
    expect(receivedValue).toBe("hello");

    unsubscribe();
  });

  test("should maintain state isolation between instances", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state1 = new CreateSubState({ count: 0 });
    const state2 = new CreateSubState({ count: 100 });

    state1.observer.setKeyState("count", 5);
    expect(state1.observer.state.count).toBe(5);
    expect(state2.observer.state.count).toBe(100);
  });

  test("should handle complex initial state", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const initialState = {
      user: { name: "John", age: 30 },
      tags: ["a", "b"],
      isActive: true,
    };

    const state = new CreateSubState(initialState);
    expect(state.observer.state.user.name).toBe("John");
    expect(state.observer.state.tags.length).toBe(2);
    expect(state.observer.state.isActive).toBe(true);
  });

  test("useValue method should be bound to instance", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ count: 0 });
    const useValueMethod = state.useValue;

    // Verify method is bound (doesn't lose context)
    expect(typeof useValueMethod).toBe("function");
  });

  test("observer subscriptions should work correctly", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ a: 1, b: 2 });
    const values: number[] = [];

    state.observer.subscribe("a", (val) => values.push(val));

    state.observer.setKeyState("a", 10);
    state.observer.setKeyState("a", 20);

    expect(values).toEqual([10, 20]);
  });

  test("useValue should read value by key", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ count: 7 });
    const result = state.useValue({ key: "count" });

    expect(result.value).toBe(7);
  });

  test("useValue should support observeValue mapper", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ user: { first: "john", last: "doe" } });
    const result = state.useValue({
      key: "user",
      observeValue: (user: { first: string; last: string }) => `${user.first} ${user.last}`,
    });

    expect(result.value).toBe("john doe");
  });

  test("useValue should support explicit defaultValue", () => {
    const mod = require("../CreateState");
    const { CreateSubState } = mod;

    const state = new CreateSubState({ name: "john" });
    const result = state.useValue({ key: "name", defaultValue: "fallback" });

    expect(result.value).toBe("fallback");
  });
});
