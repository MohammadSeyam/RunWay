import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-line bg-panel2 text-amber transition-colors group-hover:border-amber/50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 15L20 9M20 9H14M20 9V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink2">
        Runway
      </span>
    </Link>
  );
}
