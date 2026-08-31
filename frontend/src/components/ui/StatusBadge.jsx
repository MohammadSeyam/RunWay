import React from "react";

const MAP = {
  pending: { label: "Pending", cls: "bg-amber/10 text-amber border-amber/30" },
  accepted: { label: "Accepted", cls: "bg-mint/10 text-mint border-mint/30" },
  rejected: { label: "Rejected", cls: "bg-coral/10 text-coral border-coral/30" },
  open: { label: "Open", cls: "bg-mint/10 text-mint border-mint/30" },
};

export default function StatusBadge({ status = "pending" }) {
  const s = MAP[status?.toLowerCase()] || MAP.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
