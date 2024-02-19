import { useForm as useFormBase } from "../hooks";
import { Validation } from "../interfaces/Field";

interface CreateFieldComponents<C> {
  components: C;
}

interface CreateField<T, C, CP> {
  id?: string;
  name: keyof T;
  type: keyof C;
  componentProps?: CP;
  validation?: Validation<T>;
}

export function createFormInstance<C>({
  components,
}: CreateFieldComponents<C>) {
  return {
    createForm: function <T>() {
      return {
        useForm: useFormBase<T>,
        createField: function <CP>({
          id,
          name,
          type,
          componentProps,
          ...rest
        }: CreateField<T, C, CP>) {
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
