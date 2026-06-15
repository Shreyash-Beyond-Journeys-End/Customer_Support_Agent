import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { REALTIME_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

let cached: SupabaseClient | null = null;

// Returns a singleton browser Supabase client, or null when realtime
// credentials are not configured (the thread hook then polls instead).
export function getSupabase(): SupabaseClient | null {
  if (!REALTIME_ENABLED) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 5 } },
    });
  }
  return cached;
}
