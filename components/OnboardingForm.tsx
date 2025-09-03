"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { ArrowRight, Loader2 } from "lucide-react";

export const OnboardingForm: React.FC = () => {
  const {
    formData,
    errors,
    isSubmitting,
    isValidatingCorporation,
    updateField,
    validateField,
    submitForm,
    isSubmissionSuccessful,
  } = useOnboardingForm();

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Handle phone number formatting - only allow +1 prefix and digits
      if (field === "phone") {
        if (value && !value.startsWith("+1")) {
          value = "+1" + value.replace(/\D/g, "");
        } else {
          value = value.replace(/[^\d+]/g, "");
        }
        // Limit to +1 + 10 digits
        if (value.length > 12) {
          value = value.slice(0, 12);
        }
      }

      // Handle corporation number - only digits, max 9 chars
      if (field === "corporationNumber") {
        value = value.replace(/\D/g, "");
        if (value.length > 9) {
          value = value.slice(0, 9);
        }
      }

      // Handle name fields - allow typing beyond 50 chars for validation, but limit in practice
      if (field === "firstName" || field === "lastName") {
        if (value.length > 50) {
          value = value.slice(0, 50);
        }
      }

      updateField(field, value);
    };

  const handleBlur = (field: keyof typeof formData) => () => {
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  React.useEffect(() => {
    if (isSubmissionSuccessful) {
      alert("Form submitted successfully!");
    }
  }, [isSubmissionSuccessful]);

  return (
    <div className="max-w-3xl w-full bg-neutral-100 px-20 py-10  h-full rounded flex flex-col items-center justify-center">
      <p className="text-semibold text-xl mb-26">Step 1 of 5</p>
      <div className="flex w-full justify-between items-center bg-white flex-col gap-4 p-8 rounded-xl border mb-auto">
        <h1 className="text-3xl  text-gray-900  text-center mb-4">
          Onboarding Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="flex gap-6 w-full justify-between ">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2 w-full"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                onBlur={handleBlur("firstName")}
                placeholder="Enter your first name"
                className={`
                     h-12 rounded-lg
                 ${errors.firstName ? "border-red-500 aria-invalid" : ""}`}
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                onBlur={handleBlur("lastName")}
                placeholder="Enter your last name"
                className={`
                     h-12 rounded-lg
                 ${errors.lastName ? "border-red-500 aria-invalid" : ""}`}
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              onBlur={handleBlur("phone")}
              placeholder="+1XXXXXXXXXX"
              className={`
                     h-12 rounded-lg
                 ${errors.phone ? "border-red-500 aria-invalid" : ""}`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />

            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="corporationNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Corporation Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="corporationNumber"
                type="text"
                value={formData.corporationNumber}
                onChange={handleInputChange("corporationNumber")}
                onBlur={handleBlur("corporationNumber")}
                placeholder="123456789"
                className={`
                     h-12 rounded-lg
                 ${
                   errors.corporationNumber ? "border-red-500 aria-invalid" : ""
                 }`}
                aria-invalid={!!errors.corporationNumber}
                aria-describedby={
                  errors.corporationNumber
                    ? "corporationNumber-error"
                    : undefined
                }
              />
              {isValidatingCorporation && (
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  data-testid="corporation-loading"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            {errors.corporationNumber && (
              <p
                id="corporationNumber-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.corporationNumber}
              </p>
            )}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isValidatingCorporation}
            className="w-full h-12 rounded-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
