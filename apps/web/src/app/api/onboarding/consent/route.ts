import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api";
import { prisma } from "@vixi/db";

const CONSENT_VERSION = "2026-06";

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth instanceof NextResponse) return auth;

  const ip = req.headers.get("x-forwarded-for") ?? null;

  await prisma.userConsent.createMany({
    data: [
      {
        userId: auth.session.user.id,
        consentType: "NOT_LEGAL_ADVICE_DISCLAIMER",
        version: CONSENT_VERSION,
        ipAddress: ip,
      },
      {
        userId: auth.session.user.id,
        consentType: "TERMS_OF_SERVICE",
        version: CONSENT_VERSION,
        ipAddress: ip,
      },
    ],
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}
