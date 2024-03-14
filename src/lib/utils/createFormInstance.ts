/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useForm as useFormBase } from "../hooks";
import { Validation } from "../interfaces/Field";
import { ComponentProps } from "react";

export interface CreateFieldComponents<C> {
  components: C;
}

//@ts-ignore
type ComponentTypeProps<CT> = Omit<ComponentProps<CT>, "onChange" | "value">;

export interface CreateField<I, C, T extends keyof C> {
  id?: string;
  name: keyof I;
  type: T;

  componentProps?: ComponentTypeProps<C[T]>;
  validation?: Validation<I>;
}

export function createFormInstance<C>({
  components,
}: CreateFieldComponents<C>) {
  return {
    createForm: function <I>() {
      return {
        useForm: useFormBase<I>,
        createField: function <T extends keyof C>({
          id,
          name,
          type,
          componentProps,
          ...rest
        }: CreateField<I, C, T>) {
          const component = components[type];
          if (!component) {
            let availableComponents = "";
            if (components instanceof Object) {
              availableComponents = Object.keys(components).join(", ");
            }

            throw new Error(
              `Component type ${
                (type as string) || "empty"
              } not found available types are ${availableComponents}`
            );
          }

          const idValue = String(id || name);

          return {
            id: idValue,
            name,
            component,
            componentProps: { ...componentProps, id: idValue, name },
            ...rest,
          };
        },
      };
    },
  };
}
