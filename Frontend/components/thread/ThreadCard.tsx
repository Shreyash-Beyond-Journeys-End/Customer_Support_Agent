"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { formatTime, isResolved, resolvedBySupport } from "@/lib/utils";
import type { QueryRow } from "@/lib/types";
import { PendingState } from "./PendingState";
import { DeveloperResponse } from "./DeveloperResponse";
import { FeedbackButtons } from "./FeedbackButtons";

// One exchange = a soft rounded card pairing the user's question (right bubble)
// with its developer/AI response (left bubble) — so every question is clearly
// linked to its answer, in a friendly chat style.
export function ThreadCard({
  q,
  onReview,
}: {
  q: QueryRow;
  onReview: (queryId: string, review: "like" | "dislike") => void;
}) {
  const resolved = isResolved(q.status) && !!q.response;
  const byHuman = resolvedBySupport(q.status);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-surface p-3.5 shadow-soft sm:p-4"
    >
      {/* Question — right-aligned bubble */}
      <div className="flex justify-end">
        <div className="max-w-[86%]">
          <div className="rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[15px] leading-snug text-white">
            {q.query}
          </div>
          <div className="mt-1 pr-1 text-right text-[11px] text-muted">
            You · {formatTime(q.created_at)}
          </div>
        </div>
      </div>

      {/* Answer — left-aligned bubble with agent avatar */}
      <div className="mt-2.5 flex items-start gap-2.5">
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          {resolved ? (
            <>
              <DeveloperResponse
                text={q.response as string}
                score={q.score}
                byHuman={byHuman}
              />
              <div className="mt-1.5 flex items-center justify-between pl-1">
                <span className="text-[11px] text-muted">Was this helpful?</span>
                {!q.query_id.startsWith("temp-") && (
                  <FeedbackButtons
                    queryId={q.query_id}
                    review={q.review}
                    onOptimistic={(r) => onReview(q.query_id, r)}
                  />
                )}
              </div>
            </>
          ) : (
            <PendingState status={q.status} />
          )}
        </div>
      </div>
    </motion.article>
  );
}
