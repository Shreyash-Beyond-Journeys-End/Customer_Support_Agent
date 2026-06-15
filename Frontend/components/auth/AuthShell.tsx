import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-dotted px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2.5 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white shadow-soft">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
          {children}
        </div>
      </div>
    </main>
  );
}
