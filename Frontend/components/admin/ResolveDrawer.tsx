"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, MessagesSquare, SendHorizonal, X } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { ContextTimeline } from "./ContextTimeline";
import type { UnansweredQuery } from "@/lib/types";

// Large centered modal: conversation context on the left, a big response
// editor on the right that fills the height — comfortable to resolve in.
// Unanswered items in the context can be clicked to switch which query you're
// resolving (via onPickQuery), without closing the modal.
export function ResolveDrawer({
  query,
  onClose,
  onPickQuery,
}: {
  query: UnansweredQuery | null;
  onClose: () => void;
  onPickQuery: (queryId: string) => void;
}) {
  const qc = useQueryClient();
  const [response, setResponse] = useState("");

  // Reset the editor whenever the selected query changes.
  useEffect(() => {
    setResponse("");
  }, [query?.query_id]);

  const resolve = useMutation({
    mutationFn: () => adminApi.resolveQuery(query!.query_id, response.trim()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      setResponse("");
      onClose();
    },
  });

  return (
    <AnimatePresence>
      {query && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-soft-lg"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
                  <MessagesSquare className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ink">
                    Resolve escalation
                  </h2>
                  <p className="font-mono text-[11px] text-muted">
                    {query.query_id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </header>

            {/* Two panes */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              {/* Left — context (unanswered items are clickable) */}
              <div className="flex min-h-0 flex-1 flex-col border-b border-border md:max-w-[42%] md:border-b-0 md:border-r">
                <div className="border-b border-border px-6 py-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    Customer query
                  </p>
                  <p className="mt-1 text-[15px] font-medium text-ink">
                    {query.query}
                  </p>
                  {query.transform_query &&
                    query.transform_query !== query.query && (
                      <p className="mt-1 text-xs text-muted">
                        Interpreted as: “{query.transform_query}”
                      </p>
                    )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-muted">
                    Conversation context
                  </p>
                  <ContextTimeline
                    sessionId={query.session_id}
                    highlightQueryId={query.query_id}
                    onPick={onPickQuery}
                  />
                </div>
              </div>

              {/* Right — response editor (fills height) */}
              <div className="flex min-h-0 flex-1 flex-col p-6">
                <label className="mb-2 text-[11px] uppercase tracking-wide text-muted">
                  Your response to the customer
                </label>
                <textarea
                  autoFocus
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      if (response.trim()) resolve.mutate();
                    }
                  }}
                  placeholder="Write the answer the customer will see in their chat…"
                  className="min-h-[160px] flex-1 resize-none rounded-2xl border border-border bg-surface-2 px-4 py-3.5 text-[15px] leading-relaxed text-ink placeholder:text-muted/60 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                {resolve.isError && (
                  <p className="mt-2 text-xs text-danger">
                    Failed to resolve. Please try again.
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted">
                    Ctrl/⌘+Enter to send · appears in the customer&apos;s chat
                    live.
                  </p>
                  <button
                    onClick={() => resolve.mutate()}
                    disabled={!response.trim() || resolve.isPending}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent/90 disabled:opacity-50"
                  >
                    {resolve.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4" />
                    )}
                    Send response
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
