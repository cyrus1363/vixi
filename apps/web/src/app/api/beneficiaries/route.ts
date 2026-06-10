import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { createBeneficiary, getBeneficiaries } from "@/lib/services";
import { createBeneficiarySchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const beneficiaries = await getBeneficiaries(auth.session.user.id);
  return NextResponse.json(beneficiaries);
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const body = await parseBody(req, createBeneficiarySchema);
  if (body instanceof NextResponse) return body;
  try {
    const beneficiary = await createBeneficiary(auth.session.user.id, body.data);
    return NextResponse.json(beneficiary, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
