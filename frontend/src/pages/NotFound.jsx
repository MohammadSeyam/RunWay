import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-amber">Flight cancelled</p>
      <h1 className="mt-3 font-display text-6xl font-semibold text-ink2">404</h1>
      <p className="mt-3 text-sm text-muted">
        This gate doesn't exist. The page you're looking for may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to the board
      </Link>
    </div>
  );
}
