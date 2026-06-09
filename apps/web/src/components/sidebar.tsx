"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@vixi/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/vaults", label: "Vaults", icon: "🔒" },
  { href: "/memories", label: "Memories", icon: "📸" },
  { href: "/beneficiaries", label: "Beneficiaries", icon: "👥" },
  { href: "/check-ins", label: "Check-ins", icon: "⏰" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="h-8 w-8 rounded-lg bg-vixi-teal" />
        <span className="text-xl font-semibold tracking-tight">Vixi</span>
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-vixi-sand text-vixi-dark"
                      : "text-vixi-stone hover:bg-stone-50 hover:text-vixi-dark"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-stone-200 px-4 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-vixi-stone hover:text-vixi-dark"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <span className="mr-2 text-lg">🚪</span>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
