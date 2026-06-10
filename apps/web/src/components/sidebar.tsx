"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@vixi/ui";
import {
  Home,
  Lock,
  Camera,
  Users,
  Clock,
  ScrollText,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/vaults", label: "Vaults", icon: Lock },
  { href: "/memories", label: "Memories", icon: Camera },
  { href: "/beneficiaries", label: "Trusted Contacts", icon: Users },
  { href: "/check-ins", label: "Check-ins", icon: Clock },
  { href: "/wishes", label: "Wishes", icon: ScrollText },
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
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium outline-none motion-safe:transition-colors focus-visible:ring-2 focus-visible:ring-vixi-teal focus-visible:ring-offset-2 ${
                    active
                      ? "border-l-vixi-gold bg-vixi-sand text-vixi-dark"
                      : "border-l-transparent text-vixi-stone hover:bg-stone-50 hover:text-vixi-dark"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
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
          <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
