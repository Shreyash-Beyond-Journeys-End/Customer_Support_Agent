"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Loader2, MessagesSquare } from "lucide-react";
import type { QueryRow } from "@/lib/types";
import { ThreadCard } from "./ThreadCard";

export function QueryThread({
  queries,
  isLoading,
  error,
  onReview,
}: {
  queries: QueryRow[];
  isLoading: boolean;
  error: string | null;
  onReview: (queryId: string, review: "like" | "dislike") => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest activity.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [queries.length, queries[queries.length - 1]?.status]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger">
        {error}
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted">
        <MessagesSquare className="h-8 w-8 opacity-50" />
        <div>
          <p className="text-sm font-medium text-ink">How can we help?</p>
          <p className="text-xs">
            Ask a question below. Each answer appears threaded to your question —
            in real time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-dotted">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <AnimatePresence initial={false}>
          {queries.map((q) => (
            <ThreadCard key={q.query_id} q={q} onReview={onReview} />
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
