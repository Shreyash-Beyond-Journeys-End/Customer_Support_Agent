"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import { useAdminRealtime } from "@/lib/queries/useAdmin";
import { REALTIME_ENABLED } from "@/lib/config";
import { Radio, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ModeSwitch } from "@/components/ui/ModeSwitch";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAdminRealtime();
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-canvas/80 px-6 py-2.5 backdrop-blur">
          <span className="text-[11px] uppercase tracking-wide text-muted">
            Live operational data
          </span>
          <div className="flex items-center gap-3">
            <ModeSwitch to="user" className="py-1.5" />
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-muted"
              title={
                REALTIME_ENABLED
                  ? "Realtime via Supabase"
                  : "Auto-refreshing every 5s"
              }
            >
              {REALTIME_ENABLED ? (
                <Radio className="h-3 w-3 text-success" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {REALTIME_ENABLED ? "Realtime" : "Auto-refresh 5s"}
            </span>
            <ThemeToggle className="h-8 w-8" />
          </div>
        </div>
        <div className="flex-1 px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
