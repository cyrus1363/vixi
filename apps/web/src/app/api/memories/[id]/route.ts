import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { deleteMemory, getMemory, updateMemory } from "@/lib/services";
import { updateMemorySchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const memory = await getMemory(auth.session.user.id, id);
    return NextResponse.json(memory);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await parseBody(req, updateMemorySchema);
  if (body instanceof NextResponse) return body;
  try {
    const memory = await updateMemory(auth.session.user.id, id, body.data);
    return NextResponse.json(memory);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    await deleteMemory(auth.session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}
