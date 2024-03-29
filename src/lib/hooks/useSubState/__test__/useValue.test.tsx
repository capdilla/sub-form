/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, describe, expect, jest } from "bun:test";
import { renderHook } from "@testing-library/react";

import { StateObserver, useValue } from "..";

// Generated by CodiumAI

const initialState = {
  name: "John",
  age: 20,
};

describe("useValue", () => {
  // The function returns an object with a 'value' property.
  test("should return an object with a 'value' property", () => {
    const stateObserver = new StateObserver(initialState);
    const key = "testKey";
    const defaultValue = "defaultValue";
    const observeValue = jest.fn();

    const { result } = renderHook(() =>
      //@ts-ignore
      useValue({ key, stateObserver, defaultValue, observeValue })
    );

    expect(result.current).toHaveProperty("value");
  });

  // When called with a key and a stateObserver, the function subscribes to the stateObserver and updates the 'value' property with the observed value.
  test("should subscribe to the stateObserver and update the 'value' property with the observed value", () => {
    const stateObserver = new StateObserver(initialState);
    const key = "testKey";
    const defaultValue = "defaultValue";
    const observeValue = jest.fn().mockReturnValue("observedValue");

    const { result } = renderHook(() =>
      //@ts-ignore
      useValue({ key, stateObserver, defaultValue, observeValue })
    );

    expect(observeValue).toHaveBeenCalled();
    expect(result.current.value).toBe("observedValue");
  });

  // When called with a key and a stateObserver, the function returns the observed value.
  test("should return the observed value", () => {
    const stateObserver = new StateObserver(initialState);
    const key = "testKey";
    const defaultValue = "defaultValue";
    const observeValue = jest.fn().mockReturnValue("observedValue");

    const { result } = renderHook(() =>
      //@ts-ignore
      useValue({ key, stateObserver, defaultValue, observeValue })
    );

    expect(result.current.value).toBe("observedValue");
  });

  // When called with a key and a stateObserver, the function does not update the 'value' property if the observed value is equal to the previous value.
  test("should not update the 'value' property if the observed value is equal to the previous value", () => {
    const stateObserver = new StateObserver(initialState);
    const key = "testKey";
    const defaultValue = "defaultValue";
    const observeValue = jest.fn().mockReturnValue("observedValue");

    const { result, rerender } = renderHook(
      ({ key, stateObserver, defaultValue, observeValue }) =>
        //@ts-ignore
        useValue({ key, stateObserver, defaultValue, observeValue }),
      { initialProps: { key, stateObserver, defaultValue, observeValue } }
    );

    expect(result.current.value).toBe("observedValue");

    rerender({ key, stateObserver, defaultValue, observeValue });

    expect(result.current.value).toBe("observedValue");
  });

  // When called with a key and a stateObserver, the function does not update the 'value' property if the observed value is undefined and there is no default value.
  test("should not update the 'value' property if the observed value is undefined and there is no default value", () => {
    const stateObserver = new StateObserver(initialState);
    const key = "testKey";
    const observeValue = jest.fn().mockReturnValue(undefined);

    const { result, rerender } = renderHook(
      ({ key, stateObserver, observeValue }) =>
        //@ts-ignore
        useValue({ key, stateObserver, observeValue }),
      { initialProps: { key, stateObserver, observeValue } }
    );

    expect(result.current.value).toBeUndefined();

    rerender({ key, stateObserver, observeValue });

    expect(result.current.value).toBeUndefined();
  });
});
