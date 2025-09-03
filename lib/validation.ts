import { z } from "zod";

export const MAX_NAME_LENGTH = 50;
export const MAX_CORPORATION_NUMBER_LENGTH = 9;
export const MAX_PHONE_LENGTH = 12;

export const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(MAX_NAME_LENGTH, "First name must be 50 characters or less")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(MAX_NAME_LENGTH, "Last name must be 50 characters or less")
    .trim(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+1[0-9]{10}$/,
      "Phone number must be a valid Canadian number (format: +1XXXXXXXXXX)"
    ),

  corporationNumber: z
    .string()
    .min(1, "Corporation number is required")
    .length(
      MAX_CORPORATION_NUMBER_LENGTH,
      `Corporation number must be exactly ${MAX_CORPORATION_NUMBER_LENGTH} characters`
    )
    .regex(/^[0-9]+$/, "Corporation number must contain only digits"),
});

export type FormSchema = z.infer<typeof formSchema>;
