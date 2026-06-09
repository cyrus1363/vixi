import { z } from "zod";

const baseMemorySchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  mediaUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
});

export const createMemorySchema = baseMemorySchema.strict();

export const updateMemorySchema = baseMemorySchema.partial().strict();

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
