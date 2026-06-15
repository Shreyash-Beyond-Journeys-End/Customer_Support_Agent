"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { adminApi } from "@/lib/api/admin";
import { getSupabase } from "@/lib/supabase/client";
import { POLL_INTERVAL, REALTIME_ENABLED } from "@/lib/config";

// Admin reads must always reflect real backend data. When Supabase realtime is
// configured we invalidate on any Query change; otherwise we poll the routes.
const poll = REALTIME_ENABLED ? false : Math.max(POLL_INTERVAL, 5000);

export const adminKeys = {
  analytics: ["admin", "analytics"] as const,
  trend: ["admin", "trend"] as const,
  unanswered: ["admin", "unanswered"] as const,
  feedback: ["admin", "feedback"] as const,
  context: (id: string) => ["admin", "context", id] as const,
};

export interface TrendPoint {
  label: string;
  total: number;
  resolved: number;
}

export function useAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics,
    queryFn: () => adminApi.getAnalytics(),
    refetchInterval: poll,
  });
}

export function useUnanswered(limit = 50) {
  return useQuery({
    queryKey: adminKeys.unanswered,
    queryFn: async () => (await adminApi.getUnanswered(limit)).data ?? [],
    refetchInterval: poll,
  });
}

// Real volume-over-time, built by querying the date-ranged analytics RPC per
// hour for the last 12 hours. Empty hours can 500 (RPC returns null rate for
// zero rows) — caught per-bucket and treated as 0, so the chart never breaks.
export function useAnalyticsTrend() {
  return useQuery<TrendPoint[]>({
    queryKey: adminKeys.trend,
    refetchInterval: poll,
    queryFn: async () => {
      const now = new Date();
      const reqs: Promise<TrendPoint>[] = [];
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now);
        start.setMinutes(0, 0, 0);
        start.setHours(now.getHours() - i);
        const end = new Date(start);
        end.setMinutes(59, 59, 999);
        const label = `${String(start.getHours()).padStart(2, "0")}:00`;
        reqs.push(
          adminApi
            .getAnalytics({ start: start.toISOString(), end: end.toISOString() })
            .then((a) => ({
              label,
              total: a.total_queries,
              resolved: a.resolved_queries,
            }))
            .catch(() => ({ label, total: 0, resolved: 0 }))
        );
      }
      return Promise.all(reqs);
    },
  });
}

export function useNegativeFeedback(limit = 50) {
  return useQuery({
    queryKey: adminKeys.feedback,
    queryFn: async () => (await adminApi.getNegativeFeedback(limit)).data ?? [],
    refetchInterval: poll,
  });
}

// Subscribe once at the admin shell: any Query table change refreshes the
// dashboard so it never shows stale data.
export function useAdminRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    if (!REALTIME_ENABLED) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("admin:query")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Query" },
        () => {
          qc.invalidateQueries({ queryKey: ["admin"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}
