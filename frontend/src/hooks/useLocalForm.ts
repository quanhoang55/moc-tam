import { useState, type FormEvent } from "react";

/**
 * Local-only form validation ported from template page.js
 * (`[data-local-form]` + `[data-required]`): empty required fields and
 * invalid email values get a `.field-error` under their wrapper; a valid
 * submit fills `.local-form-message` with the success copy.
 */
export interface LocalField {
  /** id of the input to validate */
  id: string;
  required?: boolean;
  /** input type=email → validity-checked like the template */
  email?: boolean;
  /** custom message, else "This field is required" */
  error?: string;
}

export function useLocalForm(success: string) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>, fields: LocalField[]) => {
    event.preventDefault();
    const form = event.currentTarget;
    const next: Record<string, string> = {};

    for (const field of fields) {
      const input = form.querySelector<HTMLInputElement>(`#${field.id}`);
      const value = input?.value.trim() ?? "";
      const badEmail =
        Boolean(field.email) && value !== "" && input !== null && !input.validity.valid;

      if ((field.required && value === "") || badEmail) {
        next[field.id] = badEmail
          ? "Please enter a valid email."
          : (field.error ?? "This field is required");
      }
    }

    setErrors(next);
    setMessage(Object.keys(next).length > 0 ? "" : success);
  };

  return { errors, message, handleSubmit };
}
