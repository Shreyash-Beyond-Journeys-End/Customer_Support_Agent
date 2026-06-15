"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Prominent top-right toggle between the customer chat and the admin console.
export function ModeSwitch({
  to,
  className,
}: {
  to: "admin" | "user";
  className?: string;
}) {
  const href = to === "admin" ? "/admin" : "/chat";
  const label = to === "admin" ? "Switch to Admin mode" : "Switch to User mode";
  const Icon = to === "admin" ? LayoutDashboard : MessageSquare;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-3.5 py-2 text-sm font-semibold text-accent shadow-soft transition-colors hover:bg-accent/15",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
