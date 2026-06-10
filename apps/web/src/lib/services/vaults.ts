import "server-only";

import { prisma } from "@vixi/db";
import type { CreateVaultInput, UpdateVaultInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";
import { logAuditEvent } from "./audit";

export async function getVaults(userId: string) {
  return prisma.vault.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { contents: true } },
    },
  });
}

export async function getVault(userId: string, id: string) {
  const vault = await prisma.vault.findFirst({
    where: { id, userId },
    include: {
      contents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!vault) throw new NotFoundError("Vault");
  return vault;
}

export async function createVault(userId: string, input: CreateVaultInput) {
  const vault = await prisma.vault.create({ data: { ...input, userId } });
  await logAuditEvent({ userId, action: "CREATE", entityType: "Vault", entityId: vault.id, metadata: { type: vault.type } });
  return vault;
}

export async function updateVault(
  userId: string,
  id: string,
  input: UpdateVaultInput
) {
  const existing = await prisma.vault.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Vault");
  const vault = await prisma.vault.update({ where: { id, userId }, data: input });
  await logAuditEvent({ userId, action: "UPDATE", entityType: "Vault", entityId: id });
  return vault;
}

export async function deleteVault(userId: string, id: string) {
  const existing = await prisma.vault.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Vault");
  await prisma.vault.delete({ where: { id, userId } });
  await logAuditEvent({ userId, action: "DELETE", entityType: "Vault", entityId: id });
}
