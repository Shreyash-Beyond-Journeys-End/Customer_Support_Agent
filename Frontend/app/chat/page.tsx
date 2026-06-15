"use client";

import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModeSwitch } from "@/components/ui/ModeSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSessions } from "@/lib/queries/useSessions";
import { useAuth } from "@/lib/store/auth";

export default function ChatIndexPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const { createSession } = useSessions(user?.user_id);

  async function start() {
    const id = await createSession.mutateAsync();
    if (id) router.push(`/chat/${id}`);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 bg-dotted px-6 text-center">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <ModeSwitch to="admin" />
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
        <MessageSquarePlus className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Start a support conversation
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Ask anything about the product. Each answer threads directly under your
          question and updates live — even when a human support agent steps in.
        </p>
      </div>
      <Button onClick={start} disabled={createSession.isPending}>
        New conversation
      </Button>
    </div>
  );
}
