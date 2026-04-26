/* eslint-disable @typescript-eslint/no-var-requires */
import { test, describe, expect } from "bun:test";

describe("createFormInstance utility", () => {
  test("should export createFormInstance function", () => {
    const mod = require("../createFormInstance");
    expect(typeof mod.createFormInstance).toBe("function");
  });

  test("createFormInstance should return object with createForm", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

    const components = {};
    const result = createFormInstance({ components });

    expect(result).toBeDefined();
    expect(typeof result.createForm).toBe("function");
  });

  test("createForm should return useForm and createField functions", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

    const components = {};
    const { createForm } = createFormInstance({ components });
    const { useForm, createField } = createForm();

    expect(typeof useForm).toBe("function");
    expect(typeof createField).toBe("function");
  });

  test("createField should return a field object", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

      const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    const field = createField({
      name: "email",
      type: "Input",
      componentProps: {},
    });

    expect(field).toBeDefined();
    expect(field.name).toBe("email");
    expect(field.component).toBe(components.Input);
    expect(field.componentProps.name).toBe("email");
    expect(typeof field.id).toBe("string");
  });

  test("createField should accept validation rules", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

      const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    const field = createField({
      name: "email",
      type: "Input",
      validation: { required: true },
    });

    expect(field.validation).toBeDefined();
    expect(field.validation.required).toBe(true);
  });

  test("createField should accept custom validation", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

      const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    const customValidator = () => ({
      isValid: true,
      errorMessage: "",
    });

    const field = createField({
      name: "field",
      type: "Input",
      validation: { customValidation: customValidator },
    });

    expect(field.validation?.customValidation).toBe(customValidator);
  });
});

  test("createField should throw error for invalid component type", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

    const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    expect(() => {
      createField({
        name: "field",
        // @ts-expect-error intentionally passing invalid type for runtime path
        type: "InvalidType",
      });
    }).toThrow();
  });

  test("createField should set id from name if id not provided", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

    const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    const field = createField({
      name: "email",
      type: "Input",
    });

    expect(field.id).toBe("email");
  });

  test("createField should preserve id when provided", () => {
    const mod = require("../createFormInstance");
    const { createFormInstance } = mod;

    const components = { Input: () => null };
    const { createForm } = createFormInstance({ components });
    const { createField } = createForm();

    const field = createField({
      id: "custom-id",
      name: "email",
      type: "Input",
    });

    expect(field.id).toBe("custom-id");
  });
