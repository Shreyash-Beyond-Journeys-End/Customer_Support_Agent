"use client";

import { Loader2, ThumbsDown } from "lucide-react";
import { useNegativeFeedback } from "@/lib/queries/useAdmin";
import { formatTime } from "@/lib/utils";

export default function FeedbackPage() {
  const { data, isLoading, isError } = useNegativeFeedback();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Negative feedback</h1>
        <p className="text-sm text-muted">
          AI responses the customer marked unhelpful — candidates for knowledge
          base review and improvement.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          Could not load feedback.
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface py-16 text-center text-muted">
          <ThumbsDown className="h-8 w-8 opacity-50" />
          <p className="text-sm">No negative feedback yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((f) => (
            <article
              key={f.query_id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] text-danger">
                  <ThumbsDown className="h-3 w-3" /> Unhelpful
                </span>
                <time className="font-mono text-[11px] text-muted">
                  {formatTime(f.created_at)}
                </time>
              </div>
              <p className="text-[15px] font-medium text-ink">{f.query}</p>
              {f.response && (
                <p className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
                  {f.response}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
