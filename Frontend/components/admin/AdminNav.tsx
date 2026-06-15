"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Inbox, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/queue", label: "Escalation queue", icon: Inbox },
  { href: "/admin/feedback", label: "Negative feedback", icon: ThumbsDown },
  { href: "/admin/knowledge-base", label: "Knowledge base", icon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Support Admin</p>
          <p className="mt-0.5 text-[11px] text-muted">Operations console</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {items.map((it) => {
          const active = it.exact
            ? pathname === it.href
            : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent-soft text-ink"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              {it.label}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
