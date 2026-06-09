import { z } from "zod";
import { VaultType, VaultStatus } from "@prisma/client";

const baseVaultSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(VaultType).default(VaultType.GENERAL),
  status: z.nativeEnum(VaultStatus).default(VaultStatus.ACTIVE),
  unlockDate: z.coerce.date().optional(),
});

export const createVaultSchema = baseVaultSchema.strict();

export const updateVaultSchema = baseVaultSchema.partial().strict();

export type CreateVaultInput = z.infer<typeof createVaultSchema>;
export type UpdateVaultInput = z.infer<typeof updateVaultSchema>;
