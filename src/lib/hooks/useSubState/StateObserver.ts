type Fn<V> = (value: V) => void;

export class StateObserver<T> {
  state: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribers: Map<keyof T, Fn<any>[]>;
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

  subscribe<K extends keyof T>(name: K, fn: Fn<T[K]>) {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, [fn]);
    } else {
      this.subscribers.get(name)?.push(fn);
    }

    return () => this.unsubscribe({ keyName: name, fn });
  }

  subscribeToAll(fn: Fn<T>) {
    this.allKeysSubscribers.push(fn);

    return () => this.unsubscribe({ fn });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsubscribe({ keyName, fn }: { keyName?: keyof T; fn: Fn<any> }) {
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

  setKeyState<K extends keyof T>(key: K, value?: T[K]) {
    const setState = (newValue?: T[K]) => {
      this.state = {
        ...this.state,
        [key]: newValue,
      };

      this.subscribers.get(key)?.forEach((fn) => {
        fn(newValue);
      });

      this.allKeysSubscribers.forEach((fn) => {
        fn(this.state);
      });
    };

    const backupValue = this.state[key];

    setState(value);

    return () => {
      setState(backupValue);
    };
  }

  setState<K extends keyof T>(newState: Pick<T, K> | T) {
    const setState = (_newState: Pick<T, K> | T) => {
      this.state = {
        ...this.state,
        ..._newState,
      };

      if (_newState instanceof Object) {
        Object.keys(_newState).forEach((key) => {
          this.subscribers.get(key as keyof T)?.forEach((fn) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            fn(_newState[key]);
          });
        });
      }

      this.allKeysSubscribers.forEach((fn) => {
        fn(this.state);
      });
    };

    const backupState = { ...this.state };

    setState(newState);

    return () => {
      setState(backupState);
    };
  }
}
