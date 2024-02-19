import { test, describe, expect } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useForm } from "../useForm";

describe("useForm", () => {
  // Returns an object with fields, getFormState, getFormValues and updateFormState properties
  test("should return an object with fields, getFormState, getFormValues, and updateFormState properties", () => {
    const props = {
      defaultState: {},
      fields: [],
    };

    const { result } = renderHook(() => useForm(props));

    expect(result.current).toHaveProperty("fields");
    expect(result.current).toHaveProperty("getFormState");
    expect(result.current).toHaveProperty("getFormValues");
    expect(result.current).toHaveProperty("updateFormState");
  });

  // fields property is an array of objects with componentProps property containing onChange and value properties
  test("should return fields property as an array of objects with componentProps property containing onChange and value properties", () => {
    const props = {
      defaultState: {},
      fields: [
        {
          name: "field1",
          validation: {},
          componentProps: {},
        },
        {
          name: "field2",
          validation: {},
          componentProps: {},
        },
      ],
    };

    const { result } = renderHook(() => useForm(props));

    expect(result.fields).toHaveLength(2);
    expect(result.fields[0]).toHaveProperty("componentProps");
    expect(result.fields[0].componentProps).toHaveProperty("onChange");
    expect(result.fields[0].componentProps).toHaveProperty("value");
    expect(result.fields[1]).toHaveProperty("componentProps");
    expect(result.fields[1].componentProps).toHaveProperty("onChange");
    expect(result.fields[1].componentProps).toHaveProperty("value");
  });

  // getFormState returns an object with isFormValid and fields properties
  test("should return an object with isFormValid and fields properties when calling getFormState", () => {
    const props = {
      defaultState: {},
      fields: [],
    };

    const { result } = renderHook(() => useForm(props));
    const formState = result.current.getFormState();

    expect(formState).toHaveProperty("isFormValid");
    expect(formState).toHaveProperty("fields");
  });

  // createDefaultState returns an empty object if defaultState is not provided
  test("should return an empty object when calling createDefaultState with no defaultState provided", () => {
    const defaultState = undefined;

    const result = createDefaultState(defaultState);

    expect(result).toEqual({});
  });

  // validateField returns an object with isValid true and errorMessage empty string if no validation is provided
  test("should return an object with isValid true and errorMessage empty string when calling validateField with no validation provided", () => {
    const field = {
      name: "field1",
      validation: undefined,
    };
    const formState = {};

    const result = validateField(field, formState);

    expect(result).toEqual({
      isValid: true,
      errorMessage: "",
    });
  });

  // validateField returns an object with isValid false and errorMessage FIELD_REQUIRED if validation.required is true and field value is falsy
  test("should return an object with isValid false and errorMessage FIELD_REQUIRED when calling validateField with validation.required true and falsy field value", () => {
    const field = {
      name: "field1",
      validation: {
        required: true,
      },
    };
    const formState = {
      field1: {
        value: "",
      },
    };

    const result = validateField(field, formState);

    expect(result).toEqual({
      isValid: false,
      errorMessage: "FIELD_REQUIRED",
    });
  });
});
