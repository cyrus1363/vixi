import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { getSession } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/errors";

export type ApiSession = {
  user: { id: string; email?: string | null; name?: string | null };
};

export async function requireApiSession(): Promise<
  { session: ApiSession } | NextResponse
> {
  const raw = await getSession();
  if (!raw?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { session: raw as unknown as ApiSession };
}

export async function parseBody<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S
): Promise<{ data: z.output<S> } | NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body) as
    | { success: true; data: z.output<S> }
    | { success: false; error: { issues: unknown[] } };
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  return { data: parsed.data };
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  if (err instanceof ValidationError) {
    return NextResponse.json(
      { error: err.message, issues: err.issues },
      { status: 400 }
    );
  }
  console.error("[api-error]", err);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
