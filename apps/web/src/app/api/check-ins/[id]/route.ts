import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { deleteCheckIn, getCheckIn, updateCheckIn } from "@/lib/services";
import { updateCheckInSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const checkIn = await getCheckIn(auth.session.user.id, id);
    return NextResponse.json(checkIn);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await parseBody(req, updateCheckInSchema);
  if (body instanceof NextResponse) return body;
  try {
    const checkIn = await updateCheckIn(auth.session.user.id, id, body.data);
    return NextResponse.json(checkIn);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    await deleteCheckIn(auth.session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}
