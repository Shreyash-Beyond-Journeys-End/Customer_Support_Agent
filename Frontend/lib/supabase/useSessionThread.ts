"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { chatboxApi } from "@/lib/api/chatbox";
import { POLL_INTERVAL, REALTIME_ENABLED } from "@/lib/config";
import type { QueryRow } from "@/lib/types";

export interface ThreadState {
  queries: QueryRow[];
  isLoading: boolean;
  error: string | null;
  /** True when live WebSocket updates are active; false when polling. */
  live: boolean;
  /** Optimistically add a locally-created query before the row round-trips. */
  addOptimistic: (text: string) => string;
  /** Patch a row in place (used for optimistic review). */
  patchLocal: (queryId: string, patch: Partial<QueryRow>) => void;
  refetch: () => Promise<void>;
}

function mergeRow(list: QueryRow[], row: QueryRow): QueryRow[] {
  // Reconcile: if a real row arrives matching an optimistic temp row
  // (same text, still pending), replace the temp instead of duplicating.
  const tempIdx = list.findIndex(
    (q) => q.query_id.startsWith("temp-") && q.query === row.query
  );
  if (tempIdx !== -1) {
    const next = [...list];
    next[tempIdx] = row;
    return next;
  }
  const idx = list.findIndex((q) => q.query_id === row.query_id);
  if (idx !== -1) {
    const next = [...list];
    next[idx] = { ...next[idx], ...row };
    return next;
  }
  return [...list, row];
}

function sortRows(list: QueryRow[]): QueryRow[] {
  return [...list].sort((a, b) => {
    const ta = a.created_at ? Date.parse(a.created_at) : 0;
    const tb = b.created_at ? Date.parse(b.created_at) : 0;
    return ta - tb;
  });
}

export function useSessionThread(sessionId: string | null): ThreadState {
  const [queries, setQueries] = useState<QueryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tempCounter = useRef(0);

  const refetch = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await chatboxApi.getSessionQueries(sessionId);
      const rows = res.data ?? [];
      setQueries((prev) => {
        // preserve any optimistic temp rows not yet reflected server-side
        const temps = prev.filter(
          (q) =>
            q.query_id.startsWith("temp-") &&
            !rows.some((r) => r.query === q.query)
        );
        return sortRows([...rows, ...temps]);
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const addOptimistic = useCallback(
    (text: string) => {
      const id = `temp-${tempCounter.current++}`;
      const optimistic: QueryRow = {
        query_id: id,
        session_id: sessionId ?? "",
        query: text,
        transform_query: null,
        response: null,
        review: null,
        status: "Pending",
        score: null,
        created_at: new Date().toISOString(),
      };
      setQueries((prev) => sortRows([...prev, optimistic]));
      return id;
    },
    [sessionId]
  );

  const patchLocal = useCallback((queryId: string, patch: Partial<QueryRow>) => {
    setQueries((prev) =>
      prev.map((q) => (q.query_id === queryId ? { ...q, ...patch } : q))
    );
  }, []);

  // Initial load + reset on session change.
  useEffect(() => {
    setIsLoading(true);
    setQueries([]);
    void refetch();
  }, [refetch]);

  // Live updates: realtime subscription when configured, else polling.
  useEffect(() => {
    if (!sessionId) return;

    if (REALTIME_ENABLED) {
      const supabase = getSupabase();
      if (supabase) {
        const channel: RealtimeChannel = supabase
          .channel(`session:${sessionId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "Query",
              filter: `session_id=eq.${sessionId}`,
            },
            (payload) => {
              const row = payload.new as QueryRow;
              if (!row?.query_id) return;
              setQueries((prev) => sortRows(mergeRow(prev, row)));
            }
          )
          .subscribe();

        return () => {
          void supabase.removeChannel(channel);
        };
      }
    }

    // Fallback: poll the FastAPI route on an interval.
    const interval = setInterval(() => void refetch(), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [sessionId, refetch]);

  return {
    queries,
    isLoading,
    error,
    live: REALTIME_ENABLED,
    addOptimistic,
    patchLocal,
    refetch,
  };
}
