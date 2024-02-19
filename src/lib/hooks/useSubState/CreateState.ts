import { StateObserver } from "./StateObserver";
import { UseValueResult, useValue as valueBase } from "./useValue";

type UseValueParams<S, K extends keyof S, T> = {
  key: K;
  observeValue?: (state: S[K]) => T;
  defaultValue?: T;
};

export class CreateSubState<S> {
  observer: StateObserver<S>;
  constructor(defaultState: S) {
    this.observer = new StateObserver<S>(defaultState);
  }

  //Just with key return State[S[K]
  useValue<K extends keyof S, T>({
    key,
  }: Omit<UseValueParams<S, K, T>, "defaultValue" | "observeValue"> & {
    defaultValue?: undefined;
    observeValue?: undefined;
  }): UseValueResult<S[K]>;

  //With key, observeValue return T
  useValue<K extends keyof S, T>({
    key,
    observeValue,
  }: Omit<UseValueParams<S, K, T>, "defaultValue"> & {
    defaultValue?: undefined;
  }): UseValueResult<T>;

  //With key, observeValue, defaultValue return T
  useValue<K extends keyof S, T>({
    key,
    observeValue,
    defaultValue,
  }: UseValueParams<S, K, T>): UseValueResult<T>;

  useValue<K extends keyof S, T>({
    key,
    observeValue,
    defaultValue,
  }: UseValueParams<S, K, T>): UseValueResult<S[K]> | UseValueResult<T> {
    return valueBase({
      key,
      stateObserver: this.observer,
      observeValue,
      defaultValue,
    });
  }

  get() {
    return this.observer;
  }
}
