/* eslint-disable @typescript-eslint/no-var-requires */
import { describe, test, expect, mock } from "bun:test";

let capturedState: unknown;

mock.module("react", () => ({
  useRef: <T,>(value: T) => ({ current: value }),
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useMemo: <T,>(fn: () => T) => fn(),
  useEffect: (fn: () => void | (() => void)) => {
    fn();
  },
  useState: (init: unknown) => {
    let value = typeof init === "function" ? (init as () => unknown)() : init;
    capturedState = value;
    const setValue = (next: unknown) => {
      value = typeof next === "function" ? (next as (prev: unknown) => unknown)(value) : next;
      capturedState = value;
    };
    return [value, setValue];
  },
}));

describe("useWatchForm", () => {
  test("should return initial state from core", () => {
    const { useWatchForm } = require("../useFormValue");

    const core = {
      stateObserver: {
        current: {
          state: {
            name: {
              value: "john",
              validation: { isValid: true, showValidation: false, errorMessage: "" },
            },
          },
          subscribeToAll: () => () => {},
        },
      },
    };

    const state = useWatchForm(core);
    expect(state.isFormValid).toBe(true);
    expect(state.fields.name.value).toBe("john");
  });

  test("should apply mapValue when provided", () => {
    const { useWatchForm } = require("../useFormValue");

    const core = {
      stateObserver: {
        current: {
          state: {
            age: {
              value: 20,
              validation: { isValid: true, showValidation: false, errorMessage: "" },
            },
          },
          subscribeToAll: () => () => {},
        },
      },
    };

    const mapped = useWatchForm(core, {
      mapValue: (state: { isFormValid: boolean }) => state.isFormValid,
    });

    expect(mapped).toBe(true);
  });

  test("should react to subscribeToAll updates", () => {
    const { useWatchForm } = require("../useFormValue");

    let listener: ((state: unknown) => void) | undefined;
    const core = {
      stateObserver: {
        current: {
          state: {
            email: {
              value: "a@a.com",
              validation: { isValid: true, showValidation: false, errorMessage: "" },
            },
          },
          subscribeToAll: (cb: (state: unknown) => void) => {
            listener = cb;
            return () => {};
          },
        },
      },
    };

    useWatchForm(core);
    listener?.({
      email: {
        value: "b@b.com",
        validation: { isValid: true, showValidation: false, errorMessage: "" },
      },
    });

    expect(capturedState).toEqual({
      fields: {
        email: {
          value: "b@b.com",
          validation: { isValid: true, showValidation: false, errorMessage: "" },
        },
      },
      isFormValid: true,
    });
  });

  test("should throw when core has no stateObserver.current.state", () => {
    const { useWatchForm } = require("../useFormValue");

    expect(() =>
      useWatchForm({} as unknown as { stateObserver: { current: unknown } })
    ).toThrow();
  });
});
