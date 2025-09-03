import { CorporationValidationResponse, FormSubmissionResponse, FormData } from '@/types'

const API_BASE_URL = 'https://fe-hometask-api.qa.vault.tryvault.com'

export const validateCorporationNumber = async (corporationNumber: string): Promise<CorporationValidationResponse> => {
  const response = await fetch(`${API_BASE_URL}/corporation-number/${corporationNumber}`)
  if (!response.ok) {
    throw new Error('Failed to validate corporation number')
  }
  return response.json()
}

export const submitProfileDetails = async (formData: FormData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profile-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const errorData: FormSubmissionResponse = await response.json()
    throw new Error(errorData.message || 'Submission failed')
  }
}
