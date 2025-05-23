/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, describe, expect, jest } from "bun:test";

import { StateObserver } from "..";

describe("StateObserver", () => {
  // can create a new instance of StateObserver with a default state
  test("should create a new instance of StateObserver with a default state", () => {
    const defaultState = { key1: "value1", key2: "value2" };
    const observer = new StateObserver(defaultState);

    expect(observer.state).toEqual(defaultState);
  });

  // can subscribe to a key and receive updates when the key state changes
  test("should subscribe to a key and receive updates when the key state changes", () => {
    const observer = new StateObserver({ key1: "value1" });
    const callback = jest.fn();

    observer.subscribe("key1", callback);
    observer.setKeyState("key1", "updatedValue");

    expect(callback).toHaveBeenCalled();
  });

  // can unsubscribe from a key and stop receiving updates
  test("should unsubscribe from a key and stop receiving updates", () => {
    const observer = new StateObserver({ key1: "value1" });
    const callback = jest.fn();

    const unsubscribe = observer.subscribe("key1", callback);
    unsubscribe();
    observer.setKeyState("key1", "updatedValue");

    expect(callback).not.toHaveBeenCalled();
  });

  // can subscribe to a key multiple times and receive updates for each subscription
  test("should subscribe to a key multiple times and receive updates for each subscription", () => {
    const observer = new StateObserver({ key1: "value1" });
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    observer.subscribe("key1", callback1);
    observer.subscribe("key1", callback2);
    observer.setKeyState("key1", "updatedValue");

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  // can unsubscribe from a key that has no subscribers
  test("should unsubscribe from a key that has no subscribers", () => {
    const observer = new StateObserver({ key1: "value1" });
    const callback = jest.fn();

    const unsubscribe = observer.subscribe("key2", callback);
    unsubscribe();
    //@ts-ignore
    observer.setKeyState("key2", "updatedValue");

    expect(callback).not.toHaveBeenCalled();
  });

  // can set a new state with a key that does not exist in the default state
  test("should set a new state with a key that does not exist in the default state", () => {
    const observer = new StateObserver({ key1: "value1" });
    const callback = jest.fn();

    observer.subscribe("key2", callback);
    //@ts-ignore
    observer.setState({ key2: "updatedValue" });

    expect(observer.state).toEqual({ key1: "value1", key2: "updatedValue" });
    expect(callback).toHaveBeenCalled();
  });

  test("should return the default value when the key exists in the state object", () => {
    const stateObserver = new StateObserver({ key: "value" });
    expect(stateObserver.getDefaultValue("key")).toBe("value");
  });

  // Can subscribe a function to all keys
  test("should subscribe a function to all keys", () => {
    const observer = new StateObserver<number>(0);
    const fn = jest.fn();

    observer.subscribeToAll(fn);

    expect(observer.allKeysSubscribers).toContain(fn);
  });

  // Notifies all subscribers of the updated key value.
  test("should notify all subscribers of the updated key value", () => {
    const stateObserver = new StateObserver({ key: "initialValue" });

    const fn = jest.fn();

    stateObserver.subscribeToAll(fn);

    const key = "key";
    const value = "updatedValue";
    let notifiedValue;

    stateObserver.subscribe(key, (newValue) => {
      notifiedValue = newValue;
    });

    stateObserver.setKeyState(key, value);

    expect(notifiedValue).toBe(value);
    expect(fn).toHaveBeenCalled();
  });

  test("should work setKeyState and restore the value", (done) => {
    const stateObserver = new StateObserver({ key: "initialValue" });

    let updatedValueHasBeenCalled = false;
    let restoreValueHasBeenCalled = false;

    stateObserver.state.key = "restoreValue";

    stateObserver.subscribe("key", (newValue) => {
      console.log("newValue", newValue);
      if (newValue === "updatedValue") {
        updatedValueHasBeenCalled = true;
      }

      if (newValue === "restoreValue") {
        restoreValueHasBeenCalled = true;
      }
    });

    const restore = stateObserver.setKeyState("key", "updatedValue");

    setTimeout(() => {
      restore();

      expect(updatedValueHasBeenCalled).toBeTrue();
      expect(restoreValueHasBeenCalled).toBeTrue();

      done();
    }, 1000);
  });

  test("should work setOptimisticState and restore the value", (done) => {
    const stateObserver = new StateObserver({
      key: "initialValue",
      key2: "initialValue2",
    });

    const checks = {
      key: {
        updatedValueHasBeenCalled: false,
        restoreValueHasBeenCalled: false,
      },
      key2: {
        updatedValueHasBeenCalled: false,
        restoreValueHasBeenCalled: false,
      },
    };

    stateObserver.state.key = "restoreValue";
    stateObserver.state.key2 = "restoreValue";

    stateObserver.subscribeToAll((newValue) => {
      Object.entries(newValue).forEach(([key, value]) => {
        if (value === "updatedValue") {
          checks[key].updatedValueHasBeenCalled = true;
        }

        if (value === "restoreValue") {
          checks[key].restoreValueHasBeenCalled = true;
        }
      });
    });

    const restore = stateObserver.setState({
      key: "updatedValue",
      key2: "updatedValue",
    });

    setTimeout(() => {
      restore();

      Object.keys(checks).forEach((key) => {
        expect(checks[key].updatedValueHasBeenCalled).toBeTrue();
        expect(checks[key].restoreValueHasBeenCalled).toBeTrue();
      });

      done();
    }, 1000);
  });
});
