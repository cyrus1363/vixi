import "server-only";

import { auth } from "@vixi/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return auth();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session as typeof session & {
    user: NonNullable<typeof session.user> & { id: string };
  };
}

export async function requireGuest() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }
}
