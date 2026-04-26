import { test, describe, expect } from "bun:test";

import { StateObserver } from "..";

describe("StateObserver", () => {
  // ============ Basics ============
  test("should create an instance with default state", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    expect(observer.state).toEqual({ name: "John", age: 30 });
  });

  test("getDefaultValue should return the correct value for a key", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    expect(observer.getDefaultValue("name")).toBe("John");
    expect(observer.getDefaultValue("age")).toBe(30);
  });

  // ============ setState ============
  test("setState should update multiple keys at once", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    observer.setState({ name: "Jane", age: 25 });
    expect(observer.state.name).toBe("Jane");
    expect(observer.state.age).toBe(25);
  });

  test("setState should return a revert function", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    const revert = observer.setState({ name: "Jane" });
    expect(observer.state.name).toBe("Jane");
    revert();
    expect(observer.state.name).toBe("John");
  });

  test("setState should create immutable state (new object reference)", () => {
    const observer = new StateObserver({ name: "John" });
    const oldState = observer.state;
    observer.setState({ name: "Jane" });
    expect(observer.state).not.toBe(oldState);
  });

  // ============ setKeyState ============
  test("setKeyState should update a single key", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    observer.setKeyState("name", "Jane");
    expect(observer.state.name).toBe("Jane");
    expect(observer.state.age).toBe(30);
  });

  test("setKeyState should accept undefined value", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    observer.setKeyState("name", undefined);
    expect(observer.state.name).toBe(undefined);
  });

  test("setKeyState should return a revert function for optimistic updates", () => {
    const observer = new StateObserver({ liked: false });
    const revert = observer.setKeyState("liked", true);
    expect(observer.state.liked).toBe(true);
    revert();
    expect(observer.state.liked).toBe(false);
  });

  test("setKeyState should handle complex objects", () => {
    const observer = new StateObserver({ user: { name: "John", age: 30 } });
    observer.setKeyState("user", { name: "Jane", age: 25 });
    expect(observer.state.user).toEqual({ name: "Jane", age: 25 });
  });

  // ============ subscribe ============
  test("subscribe should call callback when specific key changes", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    let callCount = 0;
    let lastValue: unknown;

    observer.subscribe("name", (value) => {
      callCount++;
      lastValue = value;
    });

    observer.setKeyState("name", "Jane");
    expect(callCount).toBe(1);
    expect(lastValue).toBe("Jane");
  });

  test("subscribe should NOT call callback when different key changes", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    let callCount = 0;

    observer.subscribe("name", () => {
      callCount++;
    });

    observer.setKeyState("age", 25);
    expect(callCount).toBe(0);
  });

  test("subscribe should handle multiple subscribers to same key", () => {
    const observer = new StateObserver({ count: 0 });
    let count1 = 0,
      count2 = 0;

    observer.subscribe("count", () => count1++);
    observer.subscribe("count", () => count2++);

    observer.setKeyState("count", 1);
    expect(count1).toBe(1);
    expect(count2).toBe(1);
  });

  test("subscribe should return unsubscribe function", () => {
    const observer = new StateObserver({ name: "John" });
    let callCount = 0;

    const unsubscribe = observer.subscribe("name", () => {
      callCount++;
    });

    observer.setKeyState("name", "Jane");
    expect(callCount).toBe(1);

    unsubscribe();
    observer.setKeyState("name", "Bob");
    expect(callCount).toBe(1);
  });

  // ============ subscribeToAll ============
  test("subscribeToAll should call callback for any state change", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    let callCount = 0;

    observer.subscribeToAll(() => {
      callCount++;
    });

    observer.setKeyState("name", "Jane");
    expect(callCount).toBe(1);

    observer.setKeyState("age", 25);
    expect(callCount).toBe(2);
  });

  test("subscribeToAll should receive full state object", () => {
    const observer = new StateObserver({ name: "John", age: 30 });
    let receivedState: unknown;

    observer.subscribeToAll((state) => {
      receivedState = state;
    });

    observer.setKeyState("name", "Jane");
    expect(receivedState).toEqual({ name: "Jane", age: 30 });
  });

  test("subscribeToAll should return unsubscribe function", () => {
    const observer = new StateObserver({ count: 0 });
    let callCount = 0;

    const unsubscribe = observer.subscribeToAll(() => {
      callCount++;
    });

    observer.setKeyState("count", 1);
    expect(callCount).toBe(1);

    unsubscribe();
    observer.setKeyState("count", 2);
    expect(callCount).toBe(1);
  });

  // ============ Edge cases ============
  test("should handle rapid successive updates", () => {
    const observer = new StateObserver({ count: 0 });
    let callCount = 0;

    observer.subscribe("count", () => {
      callCount++;
    });

    observer.setKeyState("count", 1);
    observer.setKeyState("count", 2);
    observer.setKeyState("count", 3);

    expect(observer.state.count).toBe(3);
    expect(callCount).toBe(3);
  });

  test("should handle setting same value twice", () => {
    const observer = new StateObserver({ name: "John" });
    let callCount = 0;

    observer.subscribe("name", () => {
      callCount++;
    });

    observer.setKeyState("name", "John");
    observer.setKeyState("name", "John");

    expect(callCount).toBe(2);
  });

  test("should handle complex nested objects in setState", () => {
    const observer = new StateObserver({
      user: { name: "John", address: { city: "NYC" } },
    });

    observer.setState({
      user: {
        name: "Jane",
        address: { city: "LA" },
      },
    });

    expect(observer.state.user.name).toBe("Jane");
    expect(observer.state.user.address.city).toBe("LA");
  });

  test("setState with nested objects should call subscribers correctly", () => {
    const observer = new StateObserver({
      user: { name: "John" },
    });

    let callCount = 0;

    observer.subscribe("user", (value) => {
      callCount++;
      expect(value.name).toBe("Jane");
    });

    observer.setState({ user: { name: "Jane" } });
    expect(callCount).toBe(1);
  });

  test("should handle empty state", () => {
    const observer = new StateObserver({});
    expect(observer.state).toEqual({});
    expect(observer.subscribers.size).toBe(0);
  });

  test("multiple unsubscribes of same key should work independently", () => {
    const observer = new StateObserver({ value: 0 });
    let count1 = 0,
      count2 = 0;

    const unsub1 = observer.subscribe("value", () => count1++);
    const unsub2 = observer.subscribe("value", () => count2++);

    observer.setKeyState("value", 1);
    expect(count1).toBe(1);
    expect(count2).toBe(1);

    unsub1();
    observer.setKeyState("value", 2);
    expect(count1).toBe(1);
    expect(count2).toBe(2);

    unsub2();
    observer.setKeyState("value", 3);
    expect(count1).toBe(1);
    expect(count2).toBe(2);
  });

  test("should handle revert chain", () => {
    const observer = new StateObserver({ count: 0 });

    const revert1 = observer.setKeyState("count", 1);
    const revert2 = observer.setKeyState("count", 2);
    const revert3 = observer.setKeyState("count", 3);

    expect(observer.state.count).toBe(3);

    revert3();
    expect(observer.state.count).toBe(2);

    revert2();
    expect(observer.state.count).toBe(1);

    revert1();
    expect(observer.state.count).toBe(0);
  });

  test("setState should notify all subscribers", () => {
    const observer = new StateObserver({ a: 1, b: 2 });
    let aCount = 0,
      bCount = 0,
      allCount = 0;

    observer.subscribe("a", () => aCount++);
    observer.subscribe("b", () => bCount++);
    observer.subscribeToAll(() => allCount++);

    observer.setState({ a: 10, b: 20 });

    expect(aCount).toBe(1);
    expect(bCount).toBe(1);
    expect(allCount).toBe(1);
  });

  test("should preserve other subscribers when unsubscribing", () => {
    const observer = new StateObserver({ msg: "hello" });
    const callback1 = () => {};
    const callback2 = () => {};

    const unsub1 = observer.subscribe("msg", callback1);
    observer.subscribe("msg", callback2);

    unsub1();

    const subscribers = observer.subscribers.get("msg") || [];
    expect(subscribers.length).toBe(1);
  });
});
