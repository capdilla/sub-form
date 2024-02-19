import { StateObserver, ValidationResult } from "..";

interface FieldValue<V> {
  value: V;
  validation: ValidationResult;
}

export interface Value<T> {
  key: string;
  stateObserver: StateObserver<Record<string, FieldValue<T>>>;
}
