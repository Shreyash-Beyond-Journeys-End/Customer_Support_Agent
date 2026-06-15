export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// When Supabase browser credentials are present we use true realtime
// (WebSocket Postgres changes). Otherwise the thread hook falls back to
// polling the FastAPI route so the app still works end-to-end.
export const REALTIME_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Poll interval (ms) used only in the fallback path.
export const POLL_INTERVAL = 3000;
