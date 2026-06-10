import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@vixi/db";
import { Sidebar } from "@/components/sidebar";

const REQUIRED_CONSENT_TYPES = [
  "NOT_LEGAL_ADVICE_DISCLAIMER",
  "TERMS_OF_SERVICE",
] as const;

export async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const consentCount = await prisma.userConsent.count({
    where: {
      userId: session.user.id,
      consentType: { in: [...REQUIRED_CONSENT_TYPES] },
    },
  });

  if (consentCount < REQUIRED_CONSENT_TYPES.length) {
    redirect("/onboarding/consent");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-vixi-cream p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
