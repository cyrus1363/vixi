import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { createCheckIn, getCheckIns } from "@/lib/services";
import { createCheckInSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const checkIns = await getCheckIns(auth.session.user.id);
  return NextResponse.json(checkIns);
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const body = await parseBody(req, createCheckInSchema);
  if (body instanceof NextResponse) return body;
  try {
    const checkIn = await createCheckIn(auth.session.user.id, body.data);
    return NextResponse.json(checkIn, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
