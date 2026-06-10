import { z } from "zod";

const wishCategories = [
  "FUNERAL_PREFERENCE",
  "BURIAL_CREMATION",
  "PEOPLE_TO_NOTIFY",
  "PET_CARE",
  "DIGITAL_ACCOUNTS",
  "LEGAL_NOTES",
  "OTHER",
] as const;

export const createWishSchema = z.object({
  category: z.enum(wishCategories),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
});

export const updateWishSchema = createWishSchema.partial();

export type CreateWishInput = z.infer<typeof createWishSchema>;
export type UpdateWishInput = z.infer<typeof updateWishSchema>;
