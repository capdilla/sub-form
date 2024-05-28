import { useEffect, useState } from "react";
import { StateObserver } from "./StateObserver";
import { deepEqual as deepEqualBase } from "../../utils/deepEqual";

type State<S> = StateObserver<S>["state"];

export interface KeyObserver<S, K> {
  key: K;
  stateObserver: StateObserver<S>;
}

export interface ValueProps<T, S, K extends keyof S = keyof S>
  extends KeyObserver<S, K> {
  observeValue?: (state: State<S>[K]) => T;
  defaultValue?: T;
  deepEqual?: (a: unknown, b: unknown) => boolean;
}

export interface UseValueResult<T> {
  value: T;
}

export function useValue<T, S, K extends keyof S = keyof S>(
  params: Omit<ValueProps<T, S, K>, "observeValue" | "defaultValue"> & {
    observeValue?: undefined;
    defaultValue?: undefined;
  }
): UseValueResult<State<S>[K]>;

export function useValue<T, S, K extends keyof S = keyof S>(
  params: Omit<ValueProps<T, S, K>, "observeValue" | "defaultValue"> & {
    observeValue?: undefined;
    defaultValue?: T;
  }
): UseValueResult<T>;

export function useValue<T, S, K extends keyof S = keyof S>({
  key,
  stateObserver,
  observeValue,
}: ValueProps<T, S, K>): UseValueResult<T>;

export function useValue<T, S, K extends keyof S = keyof S>({
  key,
  stateObserver,
  defaultValue,
  observeValue,
  deepEqual = deepEqualBase,
}: ValueProps<T, S, K>): UseValueResult<T> | UseValueResult<State<S>[K]> {
  const getDefaultValue = () => {
    if (defaultValue) {
      return defaultValue;
    }

    if (observeValue) {
      return observeValue(stateObserver.getDefaultValue(key as string));
    }

    return stateObserver.getDefaultValue(key as string);
  };

  const [value, setValue] = useState<T | undefined>(getDefaultValue());

  useEffect(() => {
    const setFirstValue = () => {
      const defaultValue = stateObserver.getDefaultValue(key as string);

      const observedValue = observeValue && observeValue(defaultValue);
      const newValue =
        typeof observedValue !== "undefined" ? observedValue : defaultValue;
      setValue(newValue);
    };

    setFirstValue();

    const sub = stateObserver.subscribe<T>(key as string, (data) => {
      const observedValue = observeValue && observeValue(data as S[K]);

      const newValue =
        typeof observedValue !== "undefined" ? observedValue : data;

      setValue((prevState) => {
        if (!deepEqual(newValue, prevState)) {
          return newValue;
        }

        return prevState;
      });
    });

    return () => {
      stateObserver.unsubscribe(sub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { value } as UseValueResult<T> | UseValueResult<State<S>[K]>;
}
