import React from "react";
import Logo from "../ui/Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            A careers board that boards students onto real roles, gate by gate.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
          <span className="font-mono text-xs uppercase tracking-widest text-muted/70">
            Status
          </span>
          <span className="inline-flex items-center gap-2 text-ink2">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-mint" />
            Board is open
          </span>
          <p className="mt-2 text-xs text-muted/70">
            Built with React &amp; Vite · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
