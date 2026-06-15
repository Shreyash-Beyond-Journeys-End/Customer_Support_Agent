"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/auth";

export default function Home() {
  const router = useRouter();
  const user = useAuth((s) => s.user);

  useEffect(() => {
    router.replace(user ? "/chat" : "/login");
  }, [user, router]);

  return null;
}
