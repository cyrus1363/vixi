import "server-only";

import { prisma } from "@vixi/db";
import type { CreateCheckInInput, UpdateCheckInInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";

export async function getCheckIns(userId: string) {
  return prisma.checkIn.findMany({
    where: { userId },
    orderBy: { scheduledAt: "asc" },
  });
}

export async function getCheckIn(userId: string, id: string) {
  const checkIn = await prisma.checkIn.findFirst({ where: { id, userId } });
  if (!checkIn) throw new NotFoundError("CheckIn");
  return checkIn;
}

export async function createCheckIn(
  userId: string,
  input: CreateCheckInInput
) {
  return prisma.checkIn.create({
    data: { ...input, userId },
  });
}

export async function updateCheckIn(
  userId: string,
  id: string,
  input: UpdateCheckInInput
) {
  const existing = await prisma.checkIn.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("CheckIn");
  return prisma.checkIn.update({
    where: { id, userId },
    data: input,
  });
}

export async function deleteCheckIn(userId: string, id: string) {
  const existing = await prisma.checkIn.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("CheckIn");
  await prisma.checkIn.delete({ where: { id, userId } });
}
