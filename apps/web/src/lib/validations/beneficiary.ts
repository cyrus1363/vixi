import { z } from "zod";

const baseBeneficiarySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number")
    .optional(),
  relationship: z.string().max(50).optional(),
  trusted: z.boolean().default(false),
});

export const createBeneficiarySchema = baseBeneficiarySchema.strict();

export const updateBeneficiarySchema = baseBeneficiarySchema.partial().strict();

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>;
export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>;
