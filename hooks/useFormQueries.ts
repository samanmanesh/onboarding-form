import { useMutation, useQuery } from '@tanstack/react-query'
import { validateCorporationNumber, submitProfileDetails } from '@/lib/api'
import { FormSchema, MAX_CORPORATION_NUMBER_LENGTH } from '@/lib/validation'

export const useCorporationValidation = (corporationNumber: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['corporation-validation', corporationNumber],
    queryFn: () => validateCorporationNumber(corporationNumber),
    enabled: enabled && corporationNumber.length === MAX_CORPORATION_NUMBER_LENGTH,
    retry: 1,
  })
}

export const useFormSubmission = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (formData: FormSchema) => submitProfileDetails(formData),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
