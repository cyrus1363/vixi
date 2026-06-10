import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import {
  deleteBeneficiary,
  getBeneficiary,
  updateBeneficiary,
} from "@/lib/services";
import { updateBeneficiarySchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const beneficiary = await getBeneficiary(auth.session.user.id, id);
    return NextResponse.json(beneficiary);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await parseBody(req, updateBeneficiarySchema);
  if (body instanceof NextResponse) return body;
  try {
    const beneficiary = await updateBeneficiary(auth.session.user.id, id, body.data);
    return NextResponse.json(beneficiary);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    await deleteBeneficiary(auth.session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}
