import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, parseBody, handleApiError } from "@/lib/api";
import { createMemory, getMemories } from "@/lib/services";
import { createMemorySchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const memories = await getMemories(auth.session.user.id);
  return NextResponse.json(memories);
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;
  const body = await parseBody(req, createMemorySchema);
  if (body instanceof NextResponse) return body;
  try {
    const memory = await createMemory(auth.session.user.id, body.data);
    return NextResponse.json(memory, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
