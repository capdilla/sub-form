/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect, mock } from "bun:test";

mock.module("react", () => ({
  useRef: <T,>(value: T) => ({ current: value }),
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useEffect: (fn: () => void | (() => void)) => {
    fn();
  },
  useMemo: <T,>(fn: () => T) => fn(),
  useState: (init: unknown) => {
    let value = typeof init === "function" ? (init as () => unknown)() : init;
    const setValue = (next: unknown) => {
      value = typeof next === "function" ? (next as (prev: unknown) => unknown)(value) : next;
    };
    return [value, setValue];
  },
}));

describe("useSubState module", () => {
  test("should export useSubState function", () => {
    const mod = require("../useSubState");
    expect(typeof mod.useSubState).toBe("function");
  });

  test("should export useSubStateBase function", () => {
    const mod = require("../useSubState");
    expect(typeof mod.useSubStateBase).toBe("function");
  });

  test("StateObserver class should exist", () => {
    const mod = require("../StateObserver");
    expect(typeof mod.StateObserver).toBe("function");
  });

  test("useSubStateBase should return state helpers", () => {
    const { StateObserver } = require("../StateObserver");
    const { useSubStateBase } = require("../useSubState");

    const observer = new StateObserver({ count: 1, name: "john" });
    const sub = useSubStateBase(observer);

    expect(sub.getState()).toEqual({ count: 1, name: "john" });
    sub.setKeyState("count", 2);
    expect(sub.getState().count).toBe(2);
    sub.setState({ name: "jane" });
    expect(sub.getState().name).toBe("jane");
  });

  test("useSubState should initialize observer with initial state", () => {
    const { useSubState } = require("../useSubState");
    const sub = useSubState({ online: false });

    expect(sub.getState()).toEqual({ online: false });
    sub.setKeyState("online", true);
    expect(sub.getState().online).toBe(true);
  });
});
