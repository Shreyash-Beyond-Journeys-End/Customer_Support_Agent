"use client";

import type { TrendPoint } from "@/lib/queries/useAdmin";

// Hand-rolled SVG diagrams — dependency-free, theme-aware (use CSS color vars).

export function ResolutionDonut({ rate }: { rate: number }) {
  const pct = rate > 1 ? Math.round(rate) : Math.round(rate * 100);
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" className="stroke-border" strokeWidth="13" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            className="stroke-success"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            style={{ transition: "stroke-dasharray 0.7s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-ink">{pct}%</span>
          <span className="text-[10px] text-muted">resolved</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <Legend color="bg-success" label="Resolved without escalation" />
        <Legend color="bg-border" label="Escalated / pending" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export function OutcomeBars({
  resolved,
  escalated,
  pending,
}: {
  resolved: number;
  escalated: number;
  pending: number;
}) {
  const rows = [
    { label: "Resolved", value: resolved, color: "bg-success" },
    { label: "Escalated", value: escalated, color: "bg-pending" },
    { label: "Pending", value: pending, color: "bg-accent" },
  ];
  const total = Math.max(resolved + escalated + pending, 1);
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const p = Math.round((row.value / total) * 100);
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink">{row.label}</span>
              <span className="tabular-nums text-muted">
                {row.value} · {p}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${p}%`, transition: "width 0.7s ease" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const w = 560;
  const h = 180;
  const padX = 30;
  const padY = 22;
  const max = Math.max(...data.map((d) => d.total), 4);
  const n = Math.max(data.length - 1, 1);
  const x = (i: number) => padX + (i * (w - 2 * padX)) / n;
  const y = (v: number) => h - padY - (v / max) * (h - 2 * padY);

  const path = (key: "total" | "resolved") =>
    data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d[key])}`).join(" ");
  const area = `${path("total")} L${x(n)},${h - padY} L${x(0)},${h - padY} Z`;

  const gridYs = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.22 }} />
          <stop offset="100%" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {gridYs.map((g, i) => (
        <line
          key={i}
          x1={padX}
          x2={w - padX}
          y1={padY + g * (h - 2 * padY)}
          y2={padY + g * (h - 2 * padY)}
          className="stroke-border"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}

      {/* total volume area + line */}
      <path d={area} fill="url(#trendFill)" />
      <path d={path("total")} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" />
      {/* resolved line */}
      <path
        d={path("resolved")}
        fill="none"
        className="stroke-success"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeDasharray="1 0"
      />

      {/* x labels (every other hour) */}
      {data.map((d, i) =>
        i % 2 === 0 ? (
          <text
            key={i}
            x={x(i)}
            y={h - 4}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: 9 }}
          >
            {d.label}
          </text>
        ) : null
      )}
    </svg>
  );
}
