type Fn<V> = (value: V) => void;

export class StateObserver<T> {
  state: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribers: Map<string, Fn<any>[]>;
  //subscribe to all keys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allKeysSubscribers: Fn<any>[];

  constructor(defaultState: T) {
    this.subscribers = new Map();
    this.allKeysSubscribers = [];
    this.state = defaultState;

    // Bind all methods to ensure they don't lose context
    this.subscribe = this.subscribe.bind(this);
    this.subscribeToAll = this.subscribeToAll.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.getDefaultValue = this.getDefaultValue.bind(this);
    this.setKeyState = this.setKeyState.bind(this);
    this.setState = this.setState.bind(this);
  }

  subscribe<V>(name: string, fn: Fn<V>) {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, [fn]);
    } else {
      this.subscribers.get(name)?.push(fn);
    }

    return { keyName: name, fn };
  }

  subscribeToAll<V>(fn: Fn<V>) {
    this.allKeysSubscribers.push(fn);

    return { fn };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsubscribe({ keyName, fn }: { keyName?: string; fn: Fn<any> }) {
    if (keyName) {
      this.subscribers.set(
        keyName,
        this.subscribers.get(keyName)?.filter((f) => f !== fn) ?? []
      );
    }

    this.allKeysSubscribers = this.allKeysSubscribers.filter((f) => f !== fn);
  }

  getDefaultValue(key: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.state[key];
  }

  setKeyState(key: keyof T, value?: T[keyof T]) {
    this.state = {
      ...this.state,
      [key]: value,
    };

    this.subscribers.get(key as string)?.forEach((fn) => {
      fn(value);
    });

    this.allKeysSubscribers.forEach((fn) => {
      fn(this.state);
    });
  }

  setState<K extends keyof T>(newState: Pick<T, K> | T) {
    this.state = {
      ...this.state,
      ...newState,
    };

    if (newState instanceof Object) {
      Object.keys(newState).forEach((key) => {
        this.subscribers.get(key)?.forEach((fn) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          fn(newState[key]);
        });
      });
    }

    this.allKeysSubscribers.forEach((fn) => {
      fn(this.state);
    });
  }
}
