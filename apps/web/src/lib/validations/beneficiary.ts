import { z } from "zod";

const beneficiaryRoles = [
  "EXECUTOR",
  "BENEFICIARY",
  "EMERGENCY_CONTACT",
  "MEMORY_RECIPIENT",
  "PET_CARETAKER",
  "FUNERAL_CONTACT",
] as const;

const accessLevels = [
  "NONE",
  "SUMMARY",
  "SPECIFIC_ITEMS",
  "FULL_AFTER_RELEASE",
] as const;

const inviteStatuses = [
  "NOT_INVITED",
  "INVITED",
  "ACCEPTED",
  "DECLINED",
] as const;

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
  role: z.enum(beneficiaryRoles).default("BENEFICIARY"),
  accessLevel: z.enum(accessLevels).default("NONE"),
  inviteStatus: z.enum(inviteStatuses).default("NOT_INVITED"),
});

export const createBeneficiarySchema = baseBeneficiarySchema.strict();
export const updateBeneficiarySchema = baseBeneficiarySchema.partial().strict();

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>;
export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>;
