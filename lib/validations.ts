import { z } from "zod"

export const ApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  status: z.enum([
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
  ]),
  notes: z.string().optional(),
})

export const PartialApplicationSchema = ApplicationSchema.partial()

export type ApplicationInput = z.infer<typeof ApplicationSchema>
export type PartialApplicationInput = z.infer<typeof PartialApplicationSchema>