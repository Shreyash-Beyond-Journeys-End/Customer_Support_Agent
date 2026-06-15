"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { adminKeys } from "@/lib/queries/useAdmin";
import { cn, formatTime, isResolved } from "@/lib/utils";

// Full conversation handoff so the human agent doesn't re-read the thread.
// Unanswered items (no response, not resolved) that aren't the current one
// are clickable — clicking switches the modal to resolve that query instead.
export function ContextTimeline({
  sessionId,
  highlightQueryId,
  onPick,
}: {
  sessionId: string;
  highlightQueryId?: string;
  onPick?: (queryId: string) => void;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: adminKeys.context(sessionId),
    queryFn: async () => (await adminApi.getSessionContext(sessionId)).data ?? [],
  });

  if (isLoading)
    return (
      <div className="flex h-20 items-center justify-center text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  if (isError)
    return <p className="text-sm text-danger">Could not load session context.</p>;
  if (!data || data.length === 0)
    return <p className="text-sm text-muted">No prior context in this session.</p>;

  return (
    <ol className="space-y-3">
      {data.map((c) => {
        const active = c.query_id === highlightQueryId;
        const unanswered = !c.response && !isResolved(c.status);
        const switchable = unanswered && !active && !!onPick;

        const body = (
          <>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted">
                {active ? "This query" : switchable ? "Click to resolve" : "Earlier"}
              </span>
              <time className="font-mono text-[11px] text-muted">
                {formatTime(c.created_at)}
              </time>
            </div>
            <p className="text-sm font-medium text-ink">{c.query}</p>
            {c.response ? (
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                {c.response}
              </p>
            ) : (
              <p className="mt-1 text-xs italic text-pending">
                No response yet — under evaluation
              </p>
            )}
          </>
        );

        if (switchable) {
          return (
            <li key={c.query_id}>
              <button
                onClick={() => onPick!(c.query_id)}
                className="w-full rounded-lg border border-border bg-surface-2 p-3 text-left transition-colors hover:border-accent/50 hover:bg-accent-soft"
              >
                {body}
              </button>
            </li>
          );
        }

        return (
          <li
            key={c.query_id}
            className={cn(
              "rounded-lg border p-3",
              active
                ? "border-accent/50 bg-accent-soft"
                : "border-border bg-surface-2"
            )}
          >
            {body}
          </li>
        );
      })}
    </ol>
  );
}
