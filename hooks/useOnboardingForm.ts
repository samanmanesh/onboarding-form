import { useState, useCallback, useEffect } from "react";
import { FormData, FormErrors } from "@/types";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useCorporationValidation, useFormSubmission } from "./useFormQueries";

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const formSubmission = useFormSubmission();

  // Handle corporation validation results
  useEffect(() => {
    if (corporationQuery.data) {
      if (!corporationQuery.data.valid) {
        setErrors((prev) => ({
          ...prev,
          corporationNumber:
            corporationQuery.data?.message || "Invalid corporation number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, corporationNumber: undefined }));
      }
    }

    if (corporationQuery.error) {
      setErrors((prev) => ({
        ...prev,
        corporationNumber: "Failed to validate corporation number",
      }));
    }
  }, [corporationQuery.data, corporationQuery.error]);

  // Handle form submission results
  useEffect(() => {
    if (formSubmission.isSuccess) {
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        corporationNumber: "",
      });
      setErrors({});
      setShouldValidateCorporation(false);
    }

    if (formSubmission.error) {
      setErrors((prev) => ({
        ...prev,
        general: formSubmission.error?.message || "Submission failed",
      }));
    }
  }, [formSubmission.isSuccess, formSubmission.error]);

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
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
    async (field: keyof FormData, value: string) => {
      try {
        const fieldSchema = formSchema.shape[field];
        fieldSchema.parse(value);

        if (field === "corporationNumber" && value.length === 9) {
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
        (!corporationQuery.data || !corporationQuery.data.valid)
      ) {
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues?.forEach((issue) => {
          const field = issue.path[0] as keyof FormData;
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
    errors,
    isSubmitting: formSubmission.isPending,
    isValidatingCorporation: corporationQuery.isFetching,
    updateField,
    validateField,
    submitForm,
    isSubmissionSuccessful: formSubmission.isSuccess,
  };
};
