import "server-only";

import { prisma } from "@vixi/db";
import type { CreateVaultInput, UpdateVaultInput } from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";

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
  return prisma.vault.create({
    data: { ...input, userId },
  });
}

export async function updateVault(
  userId: string,
  id: string,
  input: UpdateVaultInput
) {
  const existing = await prisma.vault.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Vault");
  return prisma.vault.update({
    where: { id, userId },
    data: input,
  });
}

export async function deleteVault(userId: string, id: string) {
  const existing = await prisma.vault.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError("Vault");
  await prisma.vault.delete({ where: { id, userId } });
}
