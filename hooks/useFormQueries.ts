import { useMutation, useQuery } from '@tanstack/react-query'
import { validateCorporationNumber, submitProfileDetails } from '@/lib/api'
import { FormSchema } from '@/lib/validation'

export const useCorporationValidation = (corporationNumber: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['corporation-validation', corporationNumber],
    queryFn: () => validateCorporationNumber(corporationNumber),
    enabled: enabled && corporationNumber.length === 9,
    retry: 1,
  })
}

export const useFormSubmission = () => {
  return useMutation({
    mutationFn: (formData: FormSchema) => submitProfileDetails(formData),
  })
}
