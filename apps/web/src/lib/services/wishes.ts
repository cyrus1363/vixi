import "server-only";
import { prisma } from "@vixi/db";
import type { CreateWishInput, UpdateWishInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";
import { logAuditEvent } from "./audit";

export async function getWishes(userId: string) {
  return prisma.finalWish.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWish(userId: string, id: string) {
  const wish = await prisma.finalWish.findFirst({
    where: { id, userId, archivedAt: null },
  });
  if (!wish) throw new NotFoundError("Wish");
  return wish;
}

export async function createWish(userId: string, input: CreateWishInput) {
  const wish = await prisma.finalWish.create({ data: { ...input, userId } });
  await logAuditEvent({
    userId,
    action: "CREATE",
    entityType: "FinalWish",
    entityId: wish.id,
    metadata: { category: wish.category },
  });
  return wish;
}

export async function updateWish(
  userId: string,
  id: string,
  input: UpdateWishInput
) {
  const existing = await prisma.finalWish.findFirst({
    where: { id, userId, archivedAt: null },
  });
  if (!existing) throw new NotFoundError("Wish");
  const wish = await prisma.finalWish.update({ where: { id }, data: input });
  await logAuditEvent({ userId, action: "UPDATE", entityType: "FinalWish", entityId: id });
  return wish;
}

export async function archiveWish(userId: string, id: string) {
  const existing = await prisma.finalWish.findFirst({
    where: { id, userId, archivedAt: null },
  });
  if (!existing) throw new NotFoundError("Wish");
  await prisma.finalWish.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
  await logAuditEvent({ userId, action: "DELETE", entityType: "FinalWish", entityId: id });
}
