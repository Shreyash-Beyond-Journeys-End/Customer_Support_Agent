import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Status casing differs by resolver: the AI graph writes "Resolved"/"Pending"/
// "InProgress"; the admin resolve RPC writes lowercase "resolved" (and sets a
// synthetic score of 1). Compare case-insensitively, and use the lowercase
// "resolved" as the signal that a human/developer answered.
export function isResolved(status?: string | null): boolean {
  return (status ?? "").toLowerCase() === "resolved";
}
export function isInProgress(status?: string | null): boolean {
  return (status ?? "").toLowerCase() === "inprogress";
}
export function resolvedBySupport(status?: string | null): boolean {
  // exact lowercase => came through the admin /resolve path
  return status === "resolved";
}

export function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
