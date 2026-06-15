"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatboxApi } from "@/lib/api/chatbox";
import type { SessionRow } from "@/lib/types";

const key = (userId: string) => ["sessions", userId] as const;

export function useSessions(userId: string | undefined) {
  const qc = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: key(userId ?? ""),
    enabled: !!userId,
    queryFn: async (): Promise<SessionRow[]> => {
      const res = await chatboxApi.getUserSessions(userId as string);
      return res.data ?? [];
    },
  });

  // The backend's create-session route returns only a message (no id), so we
  // snapshot existing ids, create, refetch, and diff to find the new session.
  const createSession = useMutation({
    mutationFn: async (): Promise<string | null> => {
      const before = new Set(
        (sessionsQuery.data ?? []).map((s) => s.session_id)
      );
      await chatboxApi.createSession(userId as string);
      const res = await chatboxApi.getUserSessions(userId as string);
      const fresh = (res.data ?? []).find((s) => !before.has(s.session_id));
      qc.setQueryData(key(userId as string), res.data ?? []);
      return fresh?.session_id ?? null;
    },
  });

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    createSession,
  };
}
