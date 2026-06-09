import { z } from "zod";
import { CheckInStatus } from "@prisma/client";

const baseCheckInSchema = z.object({
  scheduledAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
  status: z.nativeEnum(CheckInStatus).default(CheckInStatus.PENDING),
});

export const createCheckInSchema = baseCheckInSchema
  .strict()
  .refine((data) => data.scheduledAt >= new Date(), {
    message: "Scheduled date must be in the future",
    path: ["scheduledAt"],
  })
  .refine((data) => data.status === CheckInStatus.PENDING, {
    message: "New check-ins must start as PENDING",
    path: ["status"],
  });

export const updateCheckInSchema = baseCheckInSchema.partial().strict();

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
export type UpdateCheckInInput = z.infer<typeof updateCheckInSchema>;
