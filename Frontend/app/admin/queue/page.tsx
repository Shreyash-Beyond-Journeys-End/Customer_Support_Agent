"use client";

import { useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { useUnanswered } from "@/lib/queries/useAdmin";
import { ResolveDrawer } from "@/components/admin/ResolveDrawer";
import { formatTime } from "@/lib/utils";

export default function QueuePage() {
  const { data, isLoading, isError } = useUnanswered();
  const queue = data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = queue.find((q) => q.query_id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Escalation queue</h1>
        <p className="text-sm text-muted">
          Unanswered queries awaiting a developer response. Resolving one pushes
          the answer to the customer&apos;s thread in real time.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          Could not load the escalation queue.
        </div>
      ) : queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-16 text-center text-muted shadow-soft">
          <Inbox className="h-8 w-8 opacity-50" />
          <p className="text-sm">The queue is clear — no escalations pending.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Query</th>
                <th className="px-4 py-2.5 font-medium">Score</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Received</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {queue.map((q) => (
                <tr
                  key={q.query_id}
                  className="bg-surface/40 transition-colors hover:bg-surface-2"
                >
                  <td className="max-w-md px-4 py-3">
                    <p className="truncate text-ink">{q.query ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {q.score == null ? "—" : q.score.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-pending/10 px-2 py-0.5 text-[11px] text-pending">
                      {q.status ?? "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted">
                    {formatTime(q.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedId(q.query_id)}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ResolveDrawer
        query={selected}
        onPickQuery={setSelectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
