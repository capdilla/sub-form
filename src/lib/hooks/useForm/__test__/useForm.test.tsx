/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect, mock } from "bun:test";

mock.module("react", () => ({
  useRef: <T,>(value: T) => ({ current: value }),
  useCallback: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  useMemo: <T,>(fn: () => T) => fn(),
  useEffect: (fn: () => void | (() => void)) => {
    fn();
  },
}));

describe("useForm module", () => {
  test("should export useForm function", () => {
    const mod = require("../useForm");
    expect(typeof mod.useForm).toBe("function");
  });

  test("useForm should be callable", () => {
    const mod = require("../useForm");
    expect(mod.useForm).toBeDefined();
  });

  test("useForm export should be accessible", () => {
    const mod = require("../useForm");
    expect(mod).toBeDefined();
    expect(Object.keys(mod).includes("useForm")).toBe(true);
  });

  test("should build default state and expose fields", () => {
    const { useForm } = require("../useForm");

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
      { name: "age", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "", age: 0 },
      fields,
    });

    const state = form.getFormState();
    expect(state.fields.name).toBeDefined();
    expect(state.fields.age).toBeDefined();
    expect(form.fields.name.componentProps.value).toBeDefined();
    expect(typeof form.fields.name.componentProps.onChange).toBe("function");
  });

  test("on field change should update form values", () => {
    const { useForm } = require("../useForm");

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "" },
      fields,
    });

    form.fields.name.componentProps.onChange("john");
    const values = form.getFormValues();
    expect(values.values.name).toBe("john");
  });

  test("setShowValidation should update validation visibility", () => {
    const { useForm } = require("../useForm");

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "" },
      fields,
    });

    form.setShowValidation(true);
    expect(form.getFormState().fields.name.validation.showValidation).toBe(true);
  });

  test("revalidateForm should recompute required validations", () => {
    const { useForm } = require("../useForm");

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "" },
      fields,
    });

    form.revalidateForm({ showValidation: true });
    const state = form.getFormState();
    expect(state.fields.name.validation.showValidation).toBe(true);
    expect(state.fields.name.validation.isValid).toBe(false);
  });

  test("updateFormState should replace state from partial values", () => {
    const { useForm } = require("../useForm");

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
      { name: "surname", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "", surname: "" },
      fields,
    });

    form.updateFormState({ name: "john", surname: "doe" });
    const values = form.getFormValues();
    expect(values.values.name).toBe("john");
    expect(values.values.surname).toBe("doe");
  });

  test("should invoke onFormChange when state changes", () => {
    const { useForm } = require("../useForm");
    let calls = 0;

    const fields = [
      { name: "name", type: "Input", component: () => null, validation: { required: true } },
    ];

    const form = useForm({
      defaultState: { name: "" },
      fields,
      onFormChange: () => {
        calls++;
      },
    });

    form.fields.name.componentProps.onChange("john");
    expect(calls).toBeGreaterThan(0);
  });
});
