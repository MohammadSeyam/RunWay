import React from "react";

export default function Board({ rows = [], emptyMessage = "Board is warming up — connect the backend to see live listings." }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-board">
      <div className="flex items-center justify-between border-b border-line bg-panel2 px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="h-2 w-2 animate-pulseDot rounded-full bg-mint" />
          Now boarding
        </div>
        <span className="font-mono text-xs text-muted">RUNWAY BOARD · LIVE</span>
      </div>

      <div className="dot-grid">
        <div className="grid grid-cols-[1.1fr_2.4fr_1fr_1fr] gap-2 border-b border-line px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-muted/70">
          <span>Gate</span>
          <span>Destination</span>
          <span>Status</span>
          <span className="text-right">Posted</span>
        </div>

        <div className="divide-y divide-line/70">
          {rows.map((row, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 90}ms` }}
              className="flap-row animate-rise grid grid-cols-[1.1fr_2.4fr_1fr_1fr] items-center gap-2 px-5 py-3 transition-colors hover:bg-panel2/60"
            >
              <span className="truncate font-mono text-xs text-amber">{row.gate}</span>
              <span className="truncate font-display text-sm font-medium text-ink2">
                {row.destination}
              </span>
              <span className="truncate font-mono text-[11px] uppercase text-mint">
                {row.status || "Open"}
              </span>
              <span className="truncate text-right font-mono text-[11px] text-muted">
                {row.time}
              </span>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-xs text-muted">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
