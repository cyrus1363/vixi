import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createBeneficiary, getBeneficiaries } from "@/lib/services";
import { createBeneficiarySchema } from "@/lib/validations";
import { ValidationError } from "@/lib/errors";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const beneficiaries = await getBeneficiaries(session.user.id);
  return NextResponse.json(beneficiaries);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = createBeneficiarySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  try {
    const beneficiary = await createBeneficiary(session.user.id, parsed.data);
    return NextResponse.json(beneficiary, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: err.message, issues: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
