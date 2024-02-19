import "./App.css";

import { components } from "./components/Fields";
import { TestSubState, TestUseState } from "./components/TestSubState";
// import { TestSubState } from "./components/TestSubState";

import { createFormInstance, FormWrapper } from "./lib";

const { createForm } = createFormInstance({ components });

interface Form {
  name: string;
  surname: string;
}

const { createField, useForm } = createForm<Form>();

function App() {
  const {
    fields,
    getFormValues,
    updateFormState,
    getFormState,
    setShowValidation,
    revalidateForm,
  } = useForm({
    defaultState: { name: "", surname: "mundo" },
    fields: [
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
    ],
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

  return (
    <>
      <FormWrapper fields={fields} />

      <button onClick={getValue}>Submit</button>
      <button onClick={stttt}>random</button>
      <button onClick={showValidation}>Show validation</button>
      <button onClick={revalidateForm.bind(null, { showValidation: true })}>
        Re validate form
      </button>
    </>
  );
}

// export default App;

const App2 = () => {
  return (
    <>
      <TestSubState />
      <TestUseState />
    </>
  );
};

export default App2;
