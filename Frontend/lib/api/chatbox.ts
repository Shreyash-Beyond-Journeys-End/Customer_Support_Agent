import { api } from "@/lib/api/client";
import type {
  DataEnvelope,
  LoginResponse,
  MessageResponse,
  QueryRow,
  SessionRow,
} from "@/lib/types";

// 1:1 typed wrappers over the FastAPI /chatbox routes.

export const chatboxApi = {
  createUser: (name: string, email: string, password: string) =>
    api.post<MessageResponse>("/chatbox/users", { name, email, password }),

  login: (email: string, password: string) =>
    api.post<LoginResponse>("/chatbox/login", { email, password }),

  getUserSessions: (userId: string) =>
    api.get<DataEnvelope<SessionRow[]>>(`/chatbox/users/${userId}/sessions`),

  // NOTE: backend returns only { message } — not the new session id.
  // Callers re-fetch sessions and diff to discover the created session.
  createSession: (userId: string) =>
    api.post<MessageResponse>("/chatbox/sessions", { user_id: userId }),

  getSessionQueries: (sessionId: string) =>
    api.get<DataEnvelope<QueryRow[]>>(
      `/chatbox/sessions/${sessionId}/queries`
    ),

  createQuery: (sessionId: string, query: string) =>
    api.post<MessageResponse>("/chatbox/queries", {
      session_id: sessionId,
      query,
    }),

  submitReview: (queryId: string, review: "like" | "dislike") =>
    api.post<MessageResponse>(`/chatbox/queries/${queryId}/review`, {
      review,
    }),
};
