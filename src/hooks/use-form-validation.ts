"use client";

import { useState, useCallback } from "react";

type ValidatorMap<T extends string> = Record<T, () => string | null>;

interface UseFormValidationReturn<T extends string> {
  errors: Partial<Record<T, string | null>>;
  touched: Partial<Record<T, boolean>>;
  handleBlur: (field: T) => void;
  setFieldError: (field: T, error: string | null) => void;
  validateAll: (fields: T[]) => boolean;
}

export function useFormValidation<T extends string>(
  validators: ValidatorMap<T>,
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<T, string | null>>>({});
  const [touched, setTouched] = useState<Partial<Record<T, boolean>>>({});

  const handleBlur = useCallback(
    (field: T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validators[field]() }));
    },
    [validators],
  );

  const setFieldError = useCallback(
    (field: T, error: string | null) => {
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [],
  );

  /** Touch all fields, validate, and return true if no errors. */
  const validateAll = useCallback(
    (fields: T[]): boolean => {
      const allTouched = Object.fromEntries(fields.map((f) => [f, true])) as Partial<Record<T, boolean>>;
      setTouched((prev) => ({ ...prev, ...allTouched }));

      const newErrors: Partial<Record<T, string | null>> = {};
      for (const field of fields) {
        newErrors[field] = validators[field]();
      }
      setErrors(newErrors);

      return !Object.values(newErrors).some((e) => e !== null);
    },
    [validators],
  );

  return { errors, touched, handleBlur, setFieldError, validateAll };
}
