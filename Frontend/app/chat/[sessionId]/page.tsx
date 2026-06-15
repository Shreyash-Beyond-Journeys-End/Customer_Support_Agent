"use client";

import { useParams } from "next/navigation";
import { Radio, RefreshCw } from "lucide-react";
import { QueryThread } from "@/components/thread/QueryThread";
import { Composer } from "@/components/thread/Composer";
import { ModeSwitch } from "@/components/ui/ModeSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSessionThread } from "@/lib/supabase/useSessionThread";
import { chatboxApi } from "@/lib/api/chatbox";
import { cn } from "@/lib/utils";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const thread = useSessionThread(sessionId);

  async function send(text: string) {
    thread.addOptimistic(text); // instant pending card
    try {
      await chatboxApi.createQuery(sessionId, text);
      // realtime delivers the real INSERT/UPDATEs; poll-mode refetches.
      if (!thread.live) void thread.refetch();
    } catch {
      void thread.refetch();
    }
  }

  function onReview(queryId: string, review: "like" | "dislike") {
    thread.patchLocal(queryId, { review });
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
        <div>
          <h1 className="text-sm font-semibold text-ink">Conversation</h1>
          <p className="font-mono text-[11px] text-muted">
            {sessionId.slice(0, 8)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveBadge live={thread.live} />
          <ThemeToggle />
          <ModeSwitch to="admin" />
        </div>
      </header>

      <QueryThread
        queries={thread.queries}
        isLoading={thread.isLoading}
        error={thread.error}
        onReview={onReview}
      />

      <Composer onSend={send} />
    </div>
  );
}

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        live
          ? "border-success/30 bg-success/10 text-success"
          : "border-border bg-surface-2 text-muted"
      )}
      title={
        live
          ? "Live updates via Supabase Realtime"
          : "Polling for updates (configure Supabase keys for instant realtime)"
      }
    >
      {live ? (
        <Radio className="h-3 w-3" />
      ) : (
        <RefreshCw className="h-3 w-3" />
      )}
      {live ? "Live" : "Auto-refresh"}
    </span>
  );
}
