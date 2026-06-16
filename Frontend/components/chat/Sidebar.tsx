"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Bot, LogOut, MessageSquarePlus, Plus } from "lucide-react";
import { useSessions } from "@/lib/queries/useSessions";
import { useAuth } from "@/lib/store/auth";
import { cn, initials } from "@/lib/utils";

export function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.sessionId as string | undefined;
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const { sessions, createSession } = useSessions(user?.user_id);

  async function startSession() {
    const id = await createSession.mutateAsync();
    if (id) router.push(`/chat/${id}`);
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent">
          <Bot className="h-4.5 w-4.5" />
        </div>
        <span className="text-sm font-semibold">Support</span>
      </div>

      <div className="px-3">
        <button
          onClick={startSession}
          disabled={createSession.isPending}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-ink transition-colors hover:border-accent/50 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          New conversation
        </button>
      </div>

      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-3">
        {sessions.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted">
            No conversations yet.
          </p>
        )}
        {sessions.map((s, i) => (
          <Link
            key={s.session_id}
            href={`/chat/${s.session_id}`}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              s.session_id === activeId
                ? "bg-accent-soft text-ink"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            <MessageSquarePlus className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">
              Conversation {i + 1}
            </span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-ink">
            {initials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{user?.name}</p>
            <p className="truncate text-[11px] text-muted">{user?.email}</p>
          </div>
          <button
            aria-label="Log out"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
