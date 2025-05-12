import { useCallback, useEffect, useState } from "react";
import { FormCore, GetFormState } from "./useForm";
import { FormState, ValidationResult } from "../../interfaces/Field";

export interface UseWatchFormProps<T, V> {
  mapValue?: (values: GetFormState<T>) => V;
}

export function useWatchForm<T>(core: FormCore<T>): GetFormState<T>;

export function useWatchForm<T, V>(
  core: FormCore<T>,
  props?: UseWatchFormProps<T, V>
): V;

export function useWatchForm<T, V>(
  core: FormCore<T>,
  props?: UseWatchFormProps<T, V>
): GetFormState<T> | V {
  const checkIfFormIsValid = useCallback(
    (newState: FormState<T>) =>
      Object.entries<{
        value: unknown;
        validation?: ValidationResult;
      }>(newState).every(([, field]) => field.validation?.isValid),
    []
  );

  const buildState = useCallback((state: FormState<T>) => {
    return {
      fields: state,
      isFormValid: checkIfFormIsValid(state),
    };
  }, []);

  const [state, setState] = useState<V | GetFormState<T> | undefined>(() => {
    const state = buildState(core?.stateObserver?.current.state);

    if (!props?.mapValue) {
      return state;
    }

    return props?.mapValue ? (props.mapValue(state) as V) : undefined;
  });

  useEffect(() => {
    const { mapValue } = props || {};

    if (!core?.stateObserver?.current) {
      return;
    }

    const unSub = core?.stateObserver?.current.subscribeToAll((newState) => {
      const state = {
        fields: newState,
        isFormValid: checkIfFormIsValid(newState),
      };

      if (mapValue) {
        const mappedValues = mapValue(state);
        setState((prev) => {
          if (prev === mappedValues) {
            return prev;
          }

          return mappedValues;
        });

        return;
      }

      setState(state);
    });

    return () => {
      unSub();
    };
  }, []);

  return state as GetFormState<T> | V;
}
