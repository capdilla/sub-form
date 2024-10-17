# **Sub Form Library**

A lightweight, flexible library for building forms and state manager in React applications.

## **Table of Contents**

1. [Motivation](#motivation)
2. [Key Features](#key-features)
3. [Getting Started](#getting-started)
4. [API Documentation](#api-documentation)

## Motivation

Building forms can be a tedious and error-prone process, especially when dealing with complex validation rules or multiple form fields. Our library aims to simplify this process by providing a set of reusable hooks and utilities that make it easy to build robust, user-friendly forms.

Additionally, it includes a library to handle global state efficiently, optimizing performance by preventing unnecessary re-renders. This ensures that state changes are managed smoothly across the app without negatively impacting performance or user experience.

## Key Features

- **Reactive Form State**: Automatically update your form state in response to user input.
- **Validation Integration**: Seamlessly integrate with our validation library for simple and complex validation rules.
- **Deep Value Comparisons**: Use our `useValue` hook to compare deeply nested values between form updates.
- **Customizable Form Components**: Build custom form components using our hooks and utilities.

## Getting Started

To get started, follow these steps:

1. Install the library using npm or yarn: `npm install sub-form`
2. Import the library in your React project: `import { useForm } from "sub-form"`
3. Check how to create a new form [How to create a form](#example-of-how-to-use-a-form)
4. Check how to handle a state [How to handle global states](#how-to-use-substate)

## Example of how to use a form

```tsx
const { fields, revalidateForm, getFormState, setShowValidation } = useForm({
  onFormChange,
  defaultState: {
    name: "",
    surname: "",
    age: 0,
  },
  fields: [
    createField({
      type: "Input",
      name: "name",
      validation: { required: true },
    }),
    createField({
      type: "Input",
      name: "surname",
      validation: { required: true },
    }),
    createField({
      type: "Input",
      name: "age",
      validation: { required: true },
    }),
  ],
});

const handleClick = () => {
  if (getFormState().isFormValid) {
    alert("The Form is Valid");
  } else {
    alert("You should check all the fields, some fields are missing");
  }
};

return (
  <form>
    <FormWrapper fields={fields} />
    <button onClick={handleClick}>Submit</button>
  </form>
);
```

## How to Implement a Form

### Step 1

Define your components

#### Basic implementation

```tsx
// Input.tsx
import { memo } from "react";
import { Value, useValue } from "sub-form";

export interface InputProps extends Omit<Primitives, "value" | "onChange"> {
  onChange: (value: string) => void;
  value: Value<string>;
}

export const Input = (props: InputProps) => {
  const { value } = useValue({
    ...props.value,
  });

  return (
    <input
      {...props}
      onChange={(e) => props.onChange && props.onChange(e?.target?.value || "")}
      value={value.value || ""}
    />
  );
};
```

A more advance implementation

```tsx
// Input.tsx
import { memo } from "react";
import { Value, useValue } from "sub-form";

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

  if (!state?.showValidation) {
    return null;
  }

  if (state?.isValid) {
    return <p>Is Valid</p>;
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
```

### Step 2

Define your components dictionary

```tsx
//components/index.tsx

import { Input } from "./Input";
import { DropDown } from "./Dropdown";

export const components = {
  Input,
  DropDown,
};
```

### Step 3

Create a form instance with your components dictionary. This allows you to maintain a consistent look and feel across all forms throughout your app, ensuring uniformity and a cohesive user experience.

```tsx
// form.tsx
import { components } from "./components";

import { createFormInstance } from "sub-form";

export const { createForm } = createFormInstance({ components });
```

### Step 4

Create a new form

```tsx
import { FormWrapper } from "sub-form";

import { createForm } from "./form";

interface FormState {
  name: string;
  surname: string;
}

const { useForm, createField } = createForm<FormState>();

const App = () => {
  const { field, getFormValues } = useForm({
    fields: [
      createField({
        name: "name",
        type: "Input",
        validation: {
          required: true,
        },
      }),
      createField({
        name: "surname",
        type: "Input",
        validation: {
          required: true,
        },
      }),
    ],
  });

  const onSubmit = () => {

    const values = getFormValues() // name, surname
    fetch("send", body:JSON.stringify(values))

  };

  return (
    <>
      <FormWrapper fields={fields} />
      <button onClick={onSubmit}>submit</button>
    </>
  );
};
```

## useForm api

### fields

property returns the form fields that will be rendered using the FormWrapper component. This ensures that all fields are displayed consistently and aligned with the predefined form structure and design.

```tsx
  const { fields } = useForm({})

  <FormWrapper fields={fields} />
```

### getFormValues

This property is a function that returns the form fields along with the values entered by the user. This function allows you to easily retrieve the current data from the form for further processing or validation.

```tsx
const { getFormValues } = useForm({});

const processForm = () => {
  const { isFormValid, values } = getFormValues();

  values.name;
  values.surname;
};
```

### getFormState

this property return the whole form state such as, validations and field value

```tsx
const { getFormState } = useForm({});

const processForm = () => {
  const { isFormValid, fields } = getFormState();

  fields.name.value;
  fields.name.validation;
};
```

### setShowValidation(showValidation: boolean)

This property helps trigger the form to display the validation messages for each field. It ensures that all validation rules are applied, and any errors or required inputs are highlighted, guiding the user to correct them before submission.

```tsx
const { setShowValidation, getFormState } = useForm({});

const processForm = () => {
  const { isFormValid } = getFormState();

  if (!isFormValid) {
    setShowValidation(true);
  }
};
```

### revalidateForm(options: { showValidation?: boolean })

This function helps revalidate the entire form, ensuring that every field is checked for validity. Additionally, you can pass the showValidation parameter to display validation messages for each field, prompting the user to correct any errors or incomplete inputs.

```tsx
const { revalidateForm, getFormState } = useForm({});

const processForm = () => {
  revalidateForm({ showValidation: true });
};
```

## SubState

The state manager, sub-state, helps create a global state without the need for the Context API. It is easy to use and highly performant because it only re-renders the components that truly need updates. Additionally, it can prevent unnecessary re-renders when the new value is identical to the previous one, ensuring optimal performance.

### How to use SubState

### Step 1: create the state

```tsx
// state/index.ts
import { CreateSubState } from "sub-form";

interface AppState {
  name: string;
  age: number;
  tags: string[];
  menu: {
    isOpen: boolean;
  };
}

export const appState = new CreateSubState<AppState>({
  name: "",
  age: 0,
  tags: [],
  menu: {
    isOpen: false,
  },
});
```

### Step 2: use the state in your component

```tsx
// header/index.ts
import { appState } from "state";

const Header = () => {
  const { value } = appState.useValue({ key: "menu" });

  return (
    <Menu collapse={value.isOpen}>
      {items.render(() => (
        <Menu.Item />
      ))}
    </Menu>
  );
};

const UserView = () => {
  const toggleHeader = () => {
    const oldMenu = appState.observer.state.menu;
    appState.observer.setKeyState("menu", {
      isOpen: !oldMenu.isOpen,
    });
  };

  return (
    <div>
      <Header />

      <button onClick={toggleHeader}>Toggle Header</button>
    </div>
  );
};
```

## Other Use cases and API of SubState

### Observe a value

```tsx
import { appState } from "state";

const Tag = ({ index }) => {
  const { value } = appState.useValue({
    key: "tags",
    observeValue: (state) => {
      return state[index];
    },
  });

  return <span>{value}</span>;
};

const Tags = () => {
  const { value } = appState.useValue({ key: "tags" });

  return (
    <div>
      {value.map((_, index) => (
        <Tag index={index} />
      ))}
    </div>
  );
};

};
```

in this example each tag only going to be re-render if their observe value has been change

### Listen a change of a value without render the component

```tsx
// header/index.ts
import { appState } from "state";

const Header = () => {
  const { value } = appState.useValue({ key: "menu" });

  return (
    <Menu collapse={value.isOpen}>
      {items.render(() => (
        <Menu.Item />
      ))}
    </Menu>
  );
};

const EventComponent = () => {
  useEffect(() => {
    // Each time the menu changes to an open state, it will trigger an event,
    // but the component itself will not re-render. This ensures that only the event is handled,
    // optimizing performance by avoiding unnecessary re-renders.
    const unsubscribe = appState.observer.subscribe("menu", (menu) => {
      if (menu.isOpen) {
        fetch("/send-event");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <div />;
};

const UserView = () => {
  const toggleHeader = () => {
    const oldMenu = appState.observer.state.menu;
    appState.observer.setKeyState("menu", {
      isOpen: !oldMenu.isOpen,
    });
  };

  return (
    <div>
      <Header />

      <button onClick={toggleHeader}>Toggle Header</button>

      <EventComponent />
    </div>
  );
};
```

### Emit an event to other component

lets suppose that for some reason you need to emit an event to other component, and do something in that moment

```tsx
import { CreateSubState } from "sub-form";

interface AppState {
  name: string;
  age: number;
  event?: "create" | "delete" | "update"
}

export const appState = new CreateSubState<AppState>({
  name: "",
  age: 0,
  event: undefined
});

import { appState } from "state";

const Component1 = () => {
  const { value } = appState.useValue({ key: "menu" });

  useEffect(() => {
    const unsubscribe = appState.observer.subscribe("event", (event) => {
      if (event === "crate") {
        fetch("/create", {method:"POST"});
      }

      if (event === "update") {
        fetch("/update", {method:"PUT"});
      }

    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
   ...
  );
};

const Component2 = () => {
  const sendEvent = (event) => {
    appState.observer.setKeyState("event", event);
  };

  return (
    <div>
      <button onClick={sendEvent("create")}> create </button>
      <button onClick={sendEvent("update")}> update </button>
      <button onClick={sendEvent("delete")}> delete </button>
    </div>
  );
};


const App = ()=>{

  return <>
    <Component1>
    <Component2>
  </>
}
```

### Optimistic update

Suppose you want to update a component's state and make a fetch request. If the fetch fails, you need to revert the state back to its previous value. This ensures that the component maintains its original state in case of an error during the fetch operation.

```tsx

import { appState } from "state";


const LikeComponent = () => {

  const { value } = appState.useValue({ key: "liked" });

  const sendLike = () => {
    const revert = appState.observer.setKeyState("liked", true);

    // if the api call fails the state can be reverted to their old value
    fetch("send-like").catch(()=>{
        revert()
    })

  };

  return (
    <div>
      {value? ❤️ : 💔}
      <button onClick={sendLike}> send like </button>
    </div>
  );
};
```


## License

This library is licensed under the MIT license. See the [LICENSE.md](LICENSE.md) file for details.
