import React from "react";

export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel2 text-amber">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 15L20 9M20 9H14M20 9V15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink2">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-muted">{subtitle}</p>}
      {action}
    </div>
  );
}
