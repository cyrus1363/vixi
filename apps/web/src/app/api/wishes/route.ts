import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { createWish, getWishes } from "@/lib/services";
import { createWishSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const wishes = await getWishes(auth.session.user.id);
  return NextResponse.json(wishes);
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const body = await parseBody(req, createWishSchema);
  if (body instanceof NextResponse) return body;
  try {
    const wish = await createWish(auth.session.user.id, body.data);
    return NextResponse.json(wish, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
