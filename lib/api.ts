import { CorporationValidationResponse, FormSubmissionResponse } from "@/types";
import { FormSchema } from "@/lib/validation";

const API_BASE_URL = "https://fe-hometask-api.qa.vault.tryvault.com";

//the responsse of api is {"valid":false,"message":"Invalid corporation number"} for invalid corporation number and {
// "corporationNumber": "123456789",
// "valid": true
// }
//for valid corporation number it returns the corporation number and valid is true
export const validateCorporationNumber = async (
  corporationNumber: string
): Promise<CorporationValidationResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/corporation-number/${corporationNumber}`
  );

  const data: CorporationValidationResponse = await response.json();

  return data;
};

//for submition of form data it returns {
// "message": "Invalid phone number"
// } if it fails with 404, else it returns 200 status code
export const submitProfileDetails = async (
  formData: FormSchema
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profile-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData: FormSubmissionResponse = await response.json();
    throw new Error(errorData.message || "Submission failed");
  }
};
