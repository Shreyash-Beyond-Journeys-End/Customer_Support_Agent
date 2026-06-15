"use client";

import { motion } from "framer-motion";
import { Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

// Confidence meter — uses the real `score` the backend computes.
function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);
  const tone =
    score >= 0.8 ? "bg-success" : score >= 0.5 ? "bg-pending" : "bg-danger";
  return (
    <div className="flex items-center gap-2" title={`Confidence ${pct}%`}>
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-border">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] text-muted">{pct}%</span>
    </div>
  );
}

export function DeveloperResponse({
  text,
  score,
  byHuman,
}: {
  text: string;
  score: number | null;
  byHuman: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "rounded-2xl rounded-tl-md px-4 py-3",
        byHuman ? "bg-accent-soft" : "bg-surface-2"
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {byHuman ? (
            <>
              <UserRound className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent">Resolved by support</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-success" />
              <span className="text-success">AI assistant</span>
            </>
          )}
        </div>
        {!byHuman && score != null && <ConfidenceMeter score={score} />}
      </div>
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink">
        {text}
      </p>
    </motion.div>
  );
}
