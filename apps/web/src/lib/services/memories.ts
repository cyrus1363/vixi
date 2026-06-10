import "server-only";

import { prisma } from "@vixi/db";
import type { CreateMemoryInput, UpdateMemoryInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";
import { logAuditEvent } from "./audit";

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
  const memory = await prisma.memory.create({ data: { ...input, userId } });
  await logAuditEvent({ userId, action: "CREATE", entityType: "Memory", entityId: memory.id });
  return memory;
}

export async function updateMemory(
  userId: string,
  id: string,
  input: UpdateMemoryInput
) {
  const existing = await prisma.memory.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Memory");
  const memory = await prisma.memory.update({ where: { id, userId }, data: input });
  await logAuditEvent({ userId, action: "UPDATE", entityType: "Memory", entityId: id });
  return memory;
}

export async function deleteMemory(userId: string, id: string) {
  const existing = await prisma.memory.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Memory");
  await prisma.memory.delete({ where: { id, userId } });
  await logAuditEvent({ userId, action: "DELETE", entityType: "Memory", entityId: id });
}
