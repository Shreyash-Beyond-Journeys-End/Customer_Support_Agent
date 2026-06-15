"use client";

import { motion } from "framer-motion";
import { isInProgress } from "@/lib/utils";
import type { QueryStatus } from "@/lib/types";

// The signature "Under evaluation" state as a friendly answer bubble.
// Pending = queued (calm pulse). InProgress = working (shimmer).
export function PendingState({ status }: { status: QueryStatus }) {
  const working = isInProgress(status);
  const label = working ? "Evaluating your request" : "Under evaluation";
  const sub = working
    ? "Searching the knowledge base and writing a reply…"
    : "Queued — your answer will appear here automatically.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cnPending(working)}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-pending opacity-75 animate-pulse-ring" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pending" />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-pending">{label}</div>
        <div className="truncate text-xs text-muted">{sub}</div>
      </div>
    </motion.div>
  );
}

function cnPending(working: boolean) {
  const base =
    "flex items-center gap-3 rounded-2xl rounded-tl-md border border-pending/25 bg-pending/[0.08] px-4 py-3";
  return working ? `${base} shimmer` : base;
}
