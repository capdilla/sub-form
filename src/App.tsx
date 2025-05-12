import { useEffect, useState } from "react";
import "./App.css";

import { components } from "./components/Fields";
import { TestSubState, TestUseState } from "./components/TestSubState";
// import { TestSubState } from "./components/TestSubState";

import {
  createFormInstance,
  FormWrapper,
  FormCore,
  useWatchForm,
  CreateSubState,
} from "./lib";

const { createForm } = createFormInstance({ components });

interface Form {
  name: string;
  surname: string;
  age?: number;

  check: boolean;
}

const { createField, useForm } = createForm<Form>();

const form1 = [
  createField({
    name: "name",
    type: "Input",
    validation: {
      customValidation: (values) => {
        return {
          isValid: values.name.value === "hola",
          errorMessage: "El nombre debe ser hola",
        };
      },
    },
  }),
  createField({
    name: "surname",
    type: "Input",
    componentProps: {},
    validation: {
      customValidation: (values) => ({
        isValid: values.surname.value === values.name.value,
        errorMessage: "El apellido debe ser igual al nombre",
      }),
    },
  }),
];

const form2 = [
  createField({
    name: "name",
    type: "Input",
    validation: {
      customValidation: (values) => {
        return {
          isValid: values.name.value === "hola",
          errorMessage: "El nombre debe ser hola",
        };
      },
    },
  }),
  createField({
    name: "surname",
    type: "Input",
    componentProps: {},
    validation: {
      customValidation: (values) => ({
        isValid: values.surname.value === values.name.value,
        errorMessage: "El apellido debe ser igual al nombre",
      }),
    },
  }),
  createField({
    name: "age",
    type: "Input",
  }),
];

const BlockButton = ({ formCore }: { formCore: FormCore<Form> }) => {
  const { fields } = useWatchForm(formCore);

  console.log(fields);

  const isFormValid = useWatchForm(formCore, {
    mapValue: (values) => {
      return values.isFormValid;
    },
  });

  const yourAge = useWatchForm(formCore, {
    mapValue: (values) => {
      return `tu edad es: ${values?.fields?.age?.value || ""}`;
    },
  });

  // console.log(fields, "fifififif");

  return (
    <button disabled={!isFormValid}>Only when form is valid ,{yourAge}</button>
  );
};

interface St {
  person: {
    name: string;
    surname: string;
  };
}
const state = new CreateSubState<St>({
  person: { name: "hola", surname: "mundo" },
});

function App() {
  const [form, setForm] = useState(1);
  const [val, setVal] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setForm(2);
    }, 5000);
  }, []);

  const {
    fields,
    core,
    getFormValues,
    updateFormState,
    getFormState,
    setShowValidation,
    revalidateForm,
  } = useForm({
    onFormChange: (formState) => {
      state.observer.setKeyState("person", {
        name: formState.name.value,
        surname: formState.surname.value,
      });
    },

    defaultState: {
      name: form.toString(),
      surname: "mundo",
      check: false,
    },

    fields: form === 1 ? form1 : form2,
  });

  const getValue = () => {
    console.log(getFormValues());
    console.log(getFormState());
  };

  const stttt = () => {
    updateFormState({ name: "hola" });
  };

  const showValidation = () => {
    setShowValidation(true);
  };

  // const { value: person } = state.useValue({
  //   key: "person",
  // });

  return (
    <>
      <FormWrapper fields={fields} />

      {/* <div>
        {person.name} {person.surname}
      </div> */}

      <button onClick={getValue}>Submit</button>
      <button onClick={stttt}>random</button>
      <button onClick={showValidation}>Show validation</button>
      <button onClick={revalidateForm.bind(null, { showValidation: true })}>
        Re validate form
      </button>

      <BlockButton formCore={core} />
    </>
  );
}

export default App;

// const App2 = () => {
//   return (
//     <>
//       <TestSubState />
//       <TestUseState />
//     </>
//   );
// };

// export default App2;
