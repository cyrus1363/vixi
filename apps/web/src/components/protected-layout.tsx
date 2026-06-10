import { requireAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-vixi-cream p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
