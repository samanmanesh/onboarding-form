"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  MAX_CORPORATION_NUMBER_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PHONE_LENGTH,
} from "@/lib/validation";

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

  const [step, setStep] = useState(1 as number);
  const steps = [1, 2];

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (field === "phone") {
        if (value === "+") {
          value = "+1";
        } else if (value.startsWith("+1")) {
          // Extract only digits after +1 and limit to 10 digits
          const digits = value.slice(2).replace(/[^\d]/g, "").slice(0, 10);
          value = "+1" + digits;
        } else if (value.startsWith("+")) {
          // Extract only digits after + and limit to 10 digits
          const digits = value.slice(1).replace(/[^\d]/g, "").slice(0, 10);
          value = "+1" + digits;
        } else if (value.startsWith("1")) {
          // If starts with 1, treat it as country code and remove it, limit to 10 digits
          const digits = value.slice(1).replace(/[^\d]/g, "").slice(0, 10);
          value = "+1" + digits;
        } else if (value.length > 0) {
          // Extract only digits and add +1 prefix, limit to 10 digits
          const digits = value.replace(/[^\d]/g, "").slice(0, 10);
          value = "+1" + digits;
        }

        // Final length limit check
        if (value.length > MAX_PHONE_LENGTH) {
          value = value.slice(0, MAX_PHONE_LENGTH);
        }
      }

      if (field === "corporationNumber") {
        value = value.replace(/\D/g, "");
        if (value.length > MAX_CORPORATION_NUMBER_LENGTH) {
          value = value.slice(0, MAX_CORPORATION_NUMBER_LENGTH);
        }
      }

      if (field === "firstName" || field === "lastName") {
        if (value.length > MAX_NAME_LENGTH) {
          value = value.slice(0, MAX_NAME_LENGTH);
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

  useEffect(() => {
    if (isSubmissionSuccessful) {
      setStep(2);
    }
  }, [isSubmissionSuccessful]);

  return (
    <div className="max-w-3xl w-full bg-neutral-100 px-24 py-10  h-full rounded flex flex-col items-center justify-center">
      <p className="text-semibold text-xl mb-26">
        Step {step} of {steps.length}
      </p>
      {step === 1 && (
        <div className="flex w-full justify-between items-center bg-white flex-col gap-4 p-8 rounded-2xl border mb-auto">
          <h1 className="text-3xl  text-gray-900  text-center mb-4">
            Onboarding Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="flex gap-6 w-full justify-between ">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1 w-full"
                >
                  First Name
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Corporation Number
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
              <p className="text-sm text-red-600 mt-2">
                {errors.general}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isValidatingCorporation}
              className="w-full h-12  rounded-lg cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin mr-2 color-white" />
                  Submitting...
                </>
              ) : isValidatingCorporation ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin mr-2 color-white" />
                  Validating corporation number...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="h-12 w-12" />
                </>
              )}
            </Button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border mb-auto bg-white mt-24 gap-8 ">
          <h1 className="text-3xl text-gray-900  text-center mb-4">
            Your profile has been submitted successfully
          </h1>
          <p className="text-sm text-gray-500 text-center my-auto ">
            Please wait for the admin to review your profile.
            <br />
            You will receive an email once your profile is approved
          </p>

          <Button
            onClick={() => setStep(1)}
            className="w-full h-12 rounded-lg cursor-pointer"
          >
            {" "}
            <ArrowLeft className="h-8 w-8" /> Try again
          </Button>
        </div>
      )}
    </div>
  );
};
