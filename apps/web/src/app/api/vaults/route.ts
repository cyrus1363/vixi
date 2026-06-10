import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { createVault, getVaults } from "@/lib/services";
import { createVaultSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const vaults = await getVaults(auth.session.user.id);
  return NextResponse.json(vaults);
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const body = await parseBody(req, createVaultSchema);
  if (body instanceof NextResponse) return body;
  try {
    const vault = await createVault(auth.session.user.id, body.data);
    return NextResponse.json(vault, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
