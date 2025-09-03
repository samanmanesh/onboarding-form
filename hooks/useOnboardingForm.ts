import { useState, useCallback, useMemo } from "react";
import { FormErrors } from "@/types";
import { formSchema, MAX_CORPORATION_NUMBER_LENGTH, type FormSchema } from "@/lib/validation";
import { z } from "zod";
import { useCorporationValidation, useFormSubmission } from "./useFormQueries";

const parseServerError = (
  message: string
): { field: keyof FormSchema; message: string } | null => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("phone") || lowerMessage.includes("phone number")) {
    return { field: "phone", message };
  }
  if (
    lowerMessage.includes("first name") ||
    lowerMessage.includes("firstname")
  ) {
    return { field: "firstName", message };
  }
  if (lowerMessage.includes("last name") || lowerMessage.includes("lastname")) {
    return { field: "lastName", message };
  }
  if (
    lowerMessage.includes("corporation") ||
    lowerMessage.includes("corporation number")
  ) {
    return { field: "corporationNumber", message };
  }

  return null;
};

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<FormSchema>({
    firstName: "",
    lastName: "",
    phone: "",
    corporationNumber: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [shouldValidateCorporation, setShouldValidateCorporation] =
    useState(false);

  const corporationQuery = useCorporationValidation(
    formData.corporationNumber,
    shouldValidateCorporation
  );

  const formSubmission = useFormSubmission({
    onSuccess: () => {
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        corporationNumber: "",
      });
      setErrors({});
      setShouldValidateCorporation(false);
    },
    onError: (error: Error) => {
      const parsedError = parseServerError(error.message || "");
      if (parsedError) {
        setErrors((prev) => ({
          ...prev,
          [parsedError.field]: parsedError.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: error.message || "Submission failed",
        }));
      }
    },
  });

  // Derive corporation validation error from query state
  const corporationValidationError = useMemo(() => {
    if (corporationQuery.error) {
      return "Failed to validate corporation number";
    }
    if (corporationQuery.data && !corporationQuery.data.valid) {
      return corporationQuery.data.message || "Invalid corporation number";
    }
    return undefined;
  }, [corporationQuery.data, corporationQuery.error]);

  // Merge corporation validation error with other errors
  const allErrors = useMemo(() => {
    const mergedErrors = { ...errors };
    if (corporationValidationError) {
      mergedErrors.corporationNumber = corporationValidationError;
    } else if (shouldValidateCorporation && corporationQuery.data?.valid) {
      // Clear corporation error when validation is successful
      delete mergedErrors.corporationNumber;
    }
    return mergedErrors;
  }, [
    errors,
    corporationValidationError,
    shouldValidateCorporation,
    corporationQuery.data,
  ]);

  const updateField = useCallback(
    (field: keyof FormSchema, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      if (field === "corporationNumber") {
        setShouldValidateCorporation(false);
      }
    },
    [errors]
  );

  const validateField = useCallback(
    async (field: keyof FormSchema, value: string) => {
      try {
        const fieldSchema = formSchema.shape[field];
        fieldSchema.parse(value);

        if (field === "corporationNumber" && value.length === MAX_CORPORATION_NUMBER_LENGTH) {
          setShouldValidateCorporation(true);
        } else {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.issues?.[0]?.message || "Invalid value";
          setErrors((prev) => ({
            ...prev,
            [field]: errorMessage,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            [field]: "Invalid value",
          }));
        }
      }
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    try {
      formSchema.parse(formData);

      if (
        formData.corporationNumber &&
        corporationQuery.data !== undefined &&
        !corporationQuery.data.valid
      ) {
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues?.forEach((issue) => {
          const field = issue.path[0] as keyof FormSchema;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData, corporationQuery.data]);

  const submitForm = useCallback(async (): Promise<boolean> => {
    const isValid = validateForm();
    if (!isValid) {
      return false;
    }

    if (!corporationQuery.data || !corporationQuery.data.valid) {
      setShouldValidateCorporation(true);
      setErrors((prev) => ({
        ...prev,
        corporationNumber: "Please wait for corporation number validation",
      }));
      return false;
    }

    formSubmission.mutate(formData);
    return true;
  }, [formData, validateForm, corporationQuery.data, formSubmission]);

  return {
    formData,
    errors: allErrors,
    isSubmitting: formSubmission.isPending,
    isValidatingCorporation: corporationQuery.isFetching,
    updateField,
    validateField,
    submitForm,
    isSubmissionSuccessful: formSubmission.isSuccess,
  };
};
