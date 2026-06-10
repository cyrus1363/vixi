import "server-only";

import { prisma } from "@vixi/db";
import type {
  CreateBeneficiaryInput,
  UpdateBeneficiaryInput,
} from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";
import { logAuditEvent } from "./audit";

export async function getBeneficiaries(userId: string) {
  return prisma.beneficiary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBeneficiary(userId: string, id: string) {
  const beneficiary = await prisma.beneficiary.findFirst({
    where: { id, userId },
  });
  if (!beneficiary) throw new NotFoundError("Beneficiary");
  return beneficiary;
}

export async function createBeneficiary(
  userId: string,
  input: CreateBeneficiaryInput
) {
  const beneficiary = await prisma.beneficiary.create({ data: { ...input, userId } });
  await logAuditEvent({ userId, action: "CREATE", entityType: "Beneficiary", entityId: beneficiary.id });
  return beneficiary;
}

export async function updateBeneficiary(
  userId: string,
  id: string,
  input: UpdateBeneficiaryInput
) {
  const existing = await prisma.beneficiary.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new NotFoundError("Beneficiary");
  const beneficiary = await prisma.beneficiary.update({ where: { id, userId }, data: input });
  await logAuditEvent({ userId, action: "UPDATE", entityType: "Beneficiary", entityId: id });
  return beneficiary;
}

export async function deleteBeneficiary(userId: string, id: string) {
  const existing = await prisma.beneficiary.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new NotFoundError("Beneficiary");
  await prisma.beneficiary.delete({ where: { id, userId } });
  await logAuditEvent({ userId, action: "DELETE", entityType: "Beneficiary", entityId: id });
}
