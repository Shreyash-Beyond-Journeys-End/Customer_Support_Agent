"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { ResolutionDonut, OutcomeBars, TrendChart } from "@/components/admin/Charts";
import {
  useAnalytics,
  useAnalyticsTrend,
  useNegativeFeedback,
  useUnanswered,
} from "@/lib/queries/useAdmin";
import { formatTime } from "@/lib/utils";

export default function AdminOverview() {
  const analytics = useAnalytics();
  const trend = useAnalyticsTrend();
  const unanswered = useUnanswered();
  const feedback = useNegativeFeedback();

  const a = analytics.data;
  const pending = a
    ? Math.max(a.total_queries - a.resolved_queries - a.escalated_queries, 0)
    : 0;
  const rate = a
    ? Math.round(a.resolution_rate > 1 ? a.resolution_rate : a.resolution_rate * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Analytics overview</h1>
        <p className="text-sm text-muted">Live metrics from the support backend.</p>
      </div>

      {analytics.isLoading ? (
        <Spinner />
      ) : analytics.isError ? (
        <ErrorBox message="Could not load analytics from the backend." />
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Total queries" value={a?.total_queries ?? 0} />
            <StatCard label="Resolved" value={a?.resolved_queries ?? 0} tone="success" />
            <StatCard label="Escalated" value={a?.escalated_queries ?? 0} tone="pending" />
            <StatCard label="Resolution rate" value={`${rate}%`} tone="success" />
            <StatCard
              label="Needs KB review"
              value={feedback.data?.length ?? 0}
              tone={feedback.data?.length ? "danger" : "default"}
              hint="negative feedback"
            />
          </div>

          {/* Trend + donut */}
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink">Query volume</h2>
                <div className="flex items-center gap-4 text-[11px] text-muted">
                  <LegendDot className="bg-accent" label="Total" />
                  <LegendDot className="bg-success" label="Resolved" />
                  <span>last 12h</span>
                </div>
              </div>
              {trend.isLoading || !trend.data ? (
                <Spinner small />
              ) : (
                <TrendChart data={trend.data} />
              )}
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-semibold text-ink">Resolution rate</h2>
              <ResolutionDonut rate={a?.resolution_rate ?? 0} />
            </section>
          </div>

          {/* Outcome breakdown + recent escalations */}
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-semibold text-ink">Query outcomes</h2>
              <OutcomeBars
                resolved={a?.resolved_queries ?? 0}
                escalated={a?.escalated_queries ?? 0}
                pending={pending}
              />
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink">Recent escalations</h2>
                <Link
                  href="/admin/queue"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  Open queue <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {unanswered.isLoading ? (
                <Spinner small />
              ) : (unanswered.data?.length ?? 0) === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  Queue is clear — nothing awaiting a developer.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {unanswered.data!.slice(0, 5).map((q) => (
                    <li
                      key={q.query_id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <span className="truncate text-sm text-ink">
                        {q.query ?? "—"}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted">
                        {formatTime(q.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function Spinner({ small }: { small?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center text-muted ${
        small ? "h-40" : "h-24"
      }`}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
      {message}
    </div>
  );
}
