import { StateObserver } from "./StateObserver";
import { UseValueResult, ValueProps, useValue as valueBase } from "./useValue";

// type UseValueParams<S, K extends keyof S, T> = {
//   key: K;
//   observeValue?: (state: S[K], prev?: T) => T;
//   defaultValue?: T;
//   deepEqual?: (a: unknown, b: unknown) => boolean;
//   deps?: unknown[];
// };
type UseValueParams<S, K extends keyof S, T> = Omit<
  ValueProps<T, S, K>,
  "stateObserver"
>;

export class CreateSubState<S> {
  observer: StateObserver<S>;
  constructor(defaultState: S) {
    this.observer = new StateObserver<S>(defaultState);

    this.useValue = this.useValue.bind(this);
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
    deepEqual,
    deps,
  }: UseValueParams<S, K, T>): UseValueResult<S[K]> | UseValueResult<T> {
    return valueBase({
      key,
      stateObserver: this.observer,
      observeValue,
      defaultValue,
      deepEqual,
      deps,
    });
  }
}
