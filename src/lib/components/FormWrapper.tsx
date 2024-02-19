import { useMemo } from "react";
import { Field } from "../interfaces/Field";

interface RenderFieldProps<T> {
  field: Field<T, unknown>;
}

function RenderField<T>({ field }: RenderFieldProps<T>) {
  const Component = field.component;

  if (Component) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(field.componentProps as any)} />;
  }

  return null;
}

interface FormWrapperProps<T> {
  fields: Record<keyof T, Field<T, unknown>>;
}

export function FormWrapper<T>({ fields }: FormWrapperProps<T>) {
  const fieldsValues = useMemo(
    () => Object.values(fields) as Field<T, unknown>[],
    [fields]
  );

  return (
    <>
      {fieldsValues.map((field) => {
        return <RenderField key={field.id} field={field} />;
      })}
    </>
  );
}

interface FieldComponent<T> {
  name: keyof T;
  fields: Record<keyof T, Field<T, unknown>>;
}

export function FieldComponent<T>({ fields, name }: FieldComponent<T>) {
  const field = fields[name];

  return <RenderField key={field.id} field={field} />;
}
