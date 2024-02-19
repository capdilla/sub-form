import { test, describe, expect } from "bun:test";
import { renderHook } from "@testing-library/react";

import { StateObserver, useSubStateBase } from "..";
// Generated by CodiumAI

describe("useSubStateBase", () => {
  // Returns an object with 'stateObserver', 'setState', 'setKeyState', and 'getState' properties.
  test('should return an object with "stateObserver", "setState", "setKeyState", and "getState" properties', () => {
    const observer = new StateObserver<number>(0);
    const { result } = renderHook(() => useSubStateBase(observer));

    expect(result.current).toHaveProperty("stateObserver");
    expect(result.current).toHaveProperty("setState");
    expect(result.current).toHaveProperty("setKeyState");
    expect(result.current).toHaveProperty("getState");
  });

  // 'stateObserver' property is a mutable ref object containing the observer passed as argument.
  test('should have a "stateObserver" property that is a mutable ref object containing the observer passed as argument', () => {
    const observer = new StateObserver<number>(0);
    const { result } = renderHook(() => useSubStateBase(observer));

    expect(result.current.stateObserver.current).toBe(observer);
  });

  // 'setState' property updates the state of the observer with a new state object.
  test('should update the state of the observer with a new state object when calling "setState"', () => {
    const observer = new StateObserver<number>(0);
    const { result } = renderHook(() => useSubStateBase(observer));

    result.current.setState(1);

    expect(result.current.getState()).toBe(1);
  });

  // Returns an object with 'stateObserver', 'setState', 'setKeyState', and 'getState' properties when observer is undefined.
  test('should return an object with "stateObserver", "setState", "setKeyState", and "getState" properties when observer is undefined', () => {
    const { result } = renderHook(() =>
      useSubStateBase(new StateObserver<number>(0))
    );

    expect(result.current).toHaveProperty("stateObserver");
    expect(result.current).toHaveProperty("setState");
    expect(result.current).toHaveProperty("setKeyState");
    expect(result.current).toHaveProperty("getState");
  });

  // 'setState' property updates the state of the observer with a new state object when newState is undefined.
  test('should update the state of the observer with a new state object when calling "setState" with undefined newState', () => {
    const observer = new StateObserver<number>(0);
    const { result } = renderHook(() => useSubStateBase(observer));

    result.current.setState({});

    expect(observer.state).toBe(undefined);
  });

  // 'setKeyState' property updates a specific key of the observer's state with a new value when key is undefined.
  test('should update a specific key of the observer\'s state with a new value when calling "setKeyState" with undefined key', () => {
    const observer = new StateObserver<{ count: number }>({ count: 0 });
    const { result } = renderHook(() => useSubStateBase(observer));

    result.current.setKeyState("count", undefined);

    expect(observer.state.count).toBe(undefined);
  });
});