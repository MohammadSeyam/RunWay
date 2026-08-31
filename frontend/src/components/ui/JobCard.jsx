import React from "react";
import { Link } from "react-router-dom";
import { formatSalary, timeAgo } from "../../lib/utils.js";

export default function JobCard({ job }) {
  const company = job.company || {};
  const reqs = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex overflow-hidden rounded-xl border border-line bg-panel transition-all hover:-translate-y-0.5 hover:border-amber/40 hover:shadow-glow"
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              {company.name || "Company"}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink2 group-hover:text-amber transition-colors">
              {job.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[11px] text-amber">
            {job.jobType}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted">{job.description}</p>

        {reqs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reqs.slice(0, 4).map((r, i) => (
              <span
                key={i}
                className="rounded-md border border-line bg-panel2 px-2 py-0.5 text-[11px] text-muted"
              >
                {r}
              </span>
            ))}
            {reqs.length > 4 && (
              <span className="rounded-md border border-line bg-panel2 px-2 py-0.5 text-[11px] text-muted">
                +{reqs.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {job.location}
          </span>
          <span>{formatSalary(job.salary)}</span>
          <span>{job.position} position{job.position == 1 ? "" : "s"}</span>
          <span className="ml-auto text-muted/70">{timeAgo(job.createdAt)}</span>
        </div>
      </div>

      <div className="relative flex w-20 shrink-0 flex-col items-center justify-center border-l border-dashed border-line bg-panel2 px-2 text-center">
        <span className="ticket-notch -left-[9px] top-0" />
        <span className="ticket-notch -left-[9px] bottom-0" />
        <span className="font-mono text-[10px] uppercase text-muted">Level</span>
        <span className="mt-1 font-display text-xl font-semibold text-amber">
          {job.experienceLevel ?? "—"}
        </span>
        <span className="font-mono text-[10px] text-muted">yrs</span>
      </div>
    </Link>
  );
}
