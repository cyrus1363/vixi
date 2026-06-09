import { prisma } from "@vixi/db";
import type { CreateMemoryInput, UpdateMemoryInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";

export async function getMemories(userId: string) {
  return prisma.memory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemory(userId: string, id: string) {
  const memory = await prisma.memory.findFirst({ where: { id, userId } });
  if (!memory) throw new NotFoundError("Memory");
  return memory;
}

export async function createMemory(userId: string, input: CreateMemoryInput) {
  return prisma.memory.create({
    data: { ...input, userId },
  });
}

export async function updateMemory(
  userId: string,
  id: string,
  input: UpdateMemoryInput
) {
  const existing = await prisma.memory.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Memory");
  return prisma.memory.update({
    where: { id, userId },
    data: input,
  });
}

export async function deleteMemory(userId: string, id: string) {
  const existing = await prisma.memory.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Memory");
  await prisma.memory.delete({ where: { id, userId } });
}
