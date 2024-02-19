import { useCallback, useRef } from "react";
import { StateObserver } from "./StateObserver";

export interface SubState<T> {
  stateObserver: React.MutableRefObject<StateObserver<T>>;
  setKeyState: <K extends keyof T>(
    key: keyof T,
    value?: T[K] | undefined
  ) => void;
  setState: <K extends keyof T>(newState: T | Pick<T, K>) => void;
  getState: () => T;
}

export function useSubStateBase<T>(observer: StateObserver<T>): SubState<T> {
  const refSub = useRef(observer);

  const setKeyState = useCallback(function <K extends keyof T>(
    key: keyof T,
    value?: T[K]
  ) {
    refSub.current.setKeyState(key, value);
  }, []);

  const setState = useCallback(function <K extends keyof T>(
    newState: Pick<T, K> | T
  ) {
    refSub.current.setState(newState);
  }, []);

  const getState = useCallback(() => {
    return refSub.current.state;
  }, []);

  return {
    stateObserver: refSub,
    setState,
    setKeyState,
    getState,
  };
}

export function useSubState<T>(initialState: T): SubState<T> {
  return useSubStateBase(new StateObserver<T>(initialState));
}
