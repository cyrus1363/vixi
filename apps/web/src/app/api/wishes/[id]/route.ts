import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { archiveWish, getWish, updateWish } from "@/lib/services";
import { updateWishSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const wish = await getWish(auth.session.user.id, id);
    return NextResponse.json(wish);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await parseBody(req, updateWishSchema);
  if (body instanceof NextResponse) return body;
  try {
    const wish = await updateWish(auth.session.user.id, id, body.data);
    return NextResponse.json(wish);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    await archiveWish(auth.session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}
