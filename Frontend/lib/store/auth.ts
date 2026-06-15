import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserData } from "@/lib/types";

// Demo-grade auth: the backend /login returns user_data (no token), so we
// simply hold the user in client state and gate routes on it. Not secure for
// production — see the architecture notes on moving to Supabase Auth.
interface AuthState {
  user: UserData | null;
  setUser: (user: UserData) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) =>
        // never persist the password field
        set({ user: { user_id: user.user_id, name: user.name, email: user.email } }),
      logout: () => set({ user: null }),
    }),
    { name: "support-agent-auth" }
  )
);
