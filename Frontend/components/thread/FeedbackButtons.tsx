"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { chatboxApi } from "@/lib/api/chatbox";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

export function FeedbackButtons({
  queryId,
  review,
  onOptimistic,
}: {
  queryId: string;
  review: Review;
  onOptimistic: (review: "like" | "dislike") => void;
}) {
  const [busy, setBusy] = useState(false);

  async function submit(value: "like" | "dislike") {
    if (busy || review === value) return;
    setBusy(true);
    onOptimistic(value); // instant UI; realtime/refetch confirms
    try {
      await chatboxApi.submitReview(queryId, value);
    } catch {
      /* keep optimistic state; backend will reconcile on next load */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        aria-label="Helpful"
        onClick={() => submit("like")}
        className={cn(
          "rounded-md p-1.5 transition-colors hover:bg-surface-2",
          review === "like" ? "text-success" : "text-muted"
        )}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        aria-label="Not helpful"
        onClick={() => submit("dislike")}
        className={cn(
          "rounded-md p-1.5 transition-colors hover:bg-surface-2",
          review === "dislike" ? "text-danger" : "text-muted"
        )}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
