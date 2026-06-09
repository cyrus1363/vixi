import { requireAuth } from "@/lib/auth";
import { prisma } from "@vixi/db";

export default async function DashboardPage() {
  const session = await requireAuth();

  const [vaultCount, beneficiaryCount, memoryCount] = await Promise.all([
    prisma.vault.count({ where: { userId: session.user.id } }),
    prisma.beneficiary.count({ where: { userId: session.user.id } }),
    prisma.memory.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome back, {session.user.name || session.user.email}
      </h1>
      <p className="mt-2 text-vixi-stone">
        Here's an overview of your legacy plan.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-vixi-stone">Vaults</div>
          <div className="mt-2 text-3xl font-semibold">{vaultCount}</div>
          <p className="mt-1 text-xs text-vixi-stone">
            Secure containers for your important documents and messages.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-vixi-stone">
            Beneficiaries
          </div>
          <div className="mt-2 text-3xl font-semibold">{beneficiaryCount}</div>
          <p className="mt-1 text-xs text-vixi-stone">
            People you've designated to receive your legacy.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-vixi-stone">Memories</div>
          <div className="mt-2 text-3xl font-semibold">{memoryCount}</div>
          <p className="mt-1 text-xs text-vixi-stone">
            Cherished moments preserved for future generations.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/vaults/new"
            className="inline-flex items-center rounded-lg bg-vixi-teal px-4 py-2 text-sm font-medium text-white hover:bg-vixi-teal/90"
          >
            + Create new vault
          </a>
          <a
            href="/memories/new"
            className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-vixi-dark hover:bg-stone-50"
          >
            + Add a memory
          </a>
          <a
            href="/beneficiaries/new"
            className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-vixi-dark hover:bg-stone-50"
          >
            + Add beneficiary
          </a>
        </div>
      </div>
    </div>
  );
}
