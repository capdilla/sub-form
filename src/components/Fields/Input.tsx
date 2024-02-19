import { memo } from "react";
import { Value, useValue } from "../../lib";

type Primitives = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface ErrorMessageProps {
  value: Value<string>;
}

const ErrorMessage = memo(({ value }: ErrorMessageProps) => {
  const { value: state } = useValue({
    key: value.key,
    stateObserver: value.stateObserver,
    observeValue: (state) => state.validation,
    defaultValue: {
      isValid: true,
      showValidation: false,
      errorMessage: "",
    },
  });

  console.log({ state });

  if (!state?.showValidation) {
    return null;
  }

  if (state?.isValid) {
    return <p>Es Valido</p>;
  }

  return <p>{state?.errorMessage}</p>;
});

const BaseInput = (props: InputProps) => {
  const { value } = useValue({
    ...props.value,
    observeValue: (state) => state.value,
  });

  return (
    <input
      {...props}
      onChange={(e) => props.onChange && props.onChange(e?.target?.value || "")}
      value={value || ""}
    />
  );
};

export interface InputProps extends Omit<Primitives, "value" | "onChange"> {
  onChange: (value: string) => void;
  value: Value<string>;
}
export const Input = (props: InputProps) => {
  return (
    <>
      <BaseInput {...props} />

      <ErrorMessage value={props.value} />
    </>
  );
};
