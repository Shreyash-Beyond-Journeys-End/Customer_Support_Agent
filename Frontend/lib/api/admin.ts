import { api } from "@/lib/api/client";
import type {
  AnalyticsSummary,
  DataEnvelope,
  FeedbackQuery,
  MessageResponse,
  SessionContextQuery,
  UnansweredQuery,
  UploadFileResult,
} from "@/lib/types";

// 1:1 typed wrappers over the FastAPI /admin routes.

export const adminApi = {
  getAnalytics: (range?: { start?: string; end?: string }) => {
    const qs = new URLSearchParams();
    if (range?.start) qs.set("start_date", range.start);
    if (range?.end) qs.set("end_date", range.end);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<AnalyticsSummary>(`/admin/analytics${suffix}`);
  },

  getUnanswered: (limit = 50) =>
    api.get<DataEnvelope<UnansweredQuery[]>>(`/admin/unanswered?limit=${limit}`),

  resolveQuery: (queryId: string, adminResponse: string) =>
    api.post<MessageResponse>("/admin/resolve", {
      query_id: queryId,
      admin_response: adminResponse,
    }),

  getNegativeFeedback: (limit = 50) =>
    api.get<DataEnvelope<FeedbackQuery[]>>(
      `/admin/feedback/negative?limit=${limit}`
    ),

  getSessionContext: (sessionId: string) =>
    api.get<DataEnvelope<SessionContextQuery[]>>(
      `/admin/session/${sessionId}/context`
    ),

  uploadFile: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.postForm<UploadFileResult>("/admin/knowledge-base/upload", form);
  },

  uploadUrl: (url: string) =>
    api.post<UploadFileResult>("/admin/knowledge-base/url", { url }),
};
