import { prisma } from "@vixi/db";
import type {
  CreateBeneficiaryInput,
  UpdateBeneficiaryInput,
} from "@/lib/validations";
import { NotFoundError } from "@/lib/errors";

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
  return prisma.beneficiary.create({
    data: { ...input, userId },
  });
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
  return prisma.beneficiary.update({
    where: { id },
    data: input,
  });
}

export async function deleteBeneficiary(userId: string, id: string) {
  const existing = await prisma.beneficiary.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new NotFoundError("Beneficiary");
  await prisma.beneficiary.delete({ where: { id } });
}
