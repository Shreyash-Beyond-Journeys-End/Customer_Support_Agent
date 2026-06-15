// TypeScript mirror of the backend Pydantic models (app/models/supabase.py).
// Keep these in sync with the backend — the UI binds to these exact shapes.

export type QueryStatus = "Pending" | "InProgress" | "Resolved";
export type Review = "like" | "dislike" | null;

export interface UserData {
  user_id: string;
  name: string;
  email: string;
  // NOTE: backend currently returns the password field too (plaintext).
  // We never display or persist it beyond the in-memory auth store.
  password?: string;
}

export interface SessionRow {
  session_id: string;
  user_id: string;
  created_at?: string;
}

export interface QueryRow {
  query_id: string;
  session_id: string;
  query: string;
  transform_query: string | null;
  response: string | null;
  review: Review;
  status: QueryStatus;
  score: number | null;
  created_at?: string;
}

// ---- Admin models (mirror app/models/admin.py) ----

export interface AnalyticsSummary {
  total_queries: number;
  resolved_queries: number;
  escalated_queries: number;
  resolution_rate: number;
}

export interface UnansweredQuery {
  query_id: string;
  query: string | null;
  session_id: string;
  transform_query: string | null;
  created_at: string;
  score: number | null;
  status: string | null;
}

export interface FeedbackQuery {
  query_id: string;
  query: string | null;
  session_id: string;
  transform_query: string | null;
  response: string | null;
  review: string | null;
  created_at: string;
}

export interface SessionContextQuery {
  query_id: string;
  query: string | null;
  transform_query: string | null;
  response: string | null;
  created_at: string;
  score: number | null;
  status: string | null;
}

export interface UploadFileResult {
  message: string;
  chunks_processed: number;
}

// Envelope shapes returned by the FastAPI routes.
export interface DataEnvelope<T> {
  data: T;
}
export interface MessageResponse {
  message: string;
}
export interface LoginResponse {
  user_data: UserData;
}
