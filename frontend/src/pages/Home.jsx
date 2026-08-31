import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Board from "../components/ui/Board.jsx";
import JobCard from "../components/ui/JobCard.jsx";
import { timeAgo } from "../lib/utils.js";

const STEPS = [
  {
    n: "01",
    title: "Create your profile",
    body: "Sign up as a student or a recruiter. Students list skills and a bio; recruiters register a company.",
  },
  {
    n: "02",
    title: "Find the right gate",
    body: "Students search open roles by keyword. Recruiters post a role tied to their company.",
  },
  {
    n: "03",
    title: "Board the outcome",
    body: "Students track application status live. Recruiters review applicants and update status in one click.",
  },
];

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This backend requires a session to read jobs, so don't bother firing
    // the request for a signed-out visitor — just show the sign-in prompt.
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    api
      .get("/job/get")
      .then((res) => {
        if (mounted) setJobs(res.data?.jobs || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [isAuthenticated]);

  const rows = jobs.slice(0, 6).map((j) => ({
    gate: (j.jobType || "ROLE").toUpperCase().slice(0, 10),
    destination: `${j.title} — ${j.company?.name || "Company"}`,
    status: "Open",
    time: timeAgo(j.createdAt),
  }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-grid bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              Careers board · live
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink2 sm:text-5xl">
              Board your <span className="text-amber text-glow">next role</span>{" "}
              before it takes off.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted">
              Runway connects students to open positions and gives recruiters a
              clean gate-to-gate flow for posting roles and reviewing applicants —
              no noise, just departures.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="rounded-md bg-amber px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber-soft"
              >
                Browse open roles
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink2 transition-colors hover:border-amber/40"
                >
                  Post a role instead →
                </Link>
              )}
              {isAuthenticated && role === "recruiter" && (
                <Link
                  to="/recruiter/jobs/new"
                  className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink2 transition-colors hover:border-amber/40"
                >
                  Post a role →
                </Link>
              )}
            </div>

            {isAuthenticated ? (
              <div className="mt-10 flex gap-8 font-mono text-xs text-muted">
                <div>
                  <p className="text-2xl font-display text-ink2">{jobs.length}</p>
                  <p className="mt-1 uppercase tracking-widest">Open roles</p>
                </div>
                <div>
                  <p className="text-2xl font-display text-ink2">
                    {new Set(jobs.map((j) => j.company?._id)).size || 0}
                  </p>
                  <p className="mt-1 uppercase tracking-widest">Companies</p>
                </div>
                <div>
                  <p className="text-2xl font-display text-ink2">2</p>
                  <p className="mt-1 uppercase tracking-widest">Roles: student / recruiter</p>
                </div>
              </div>
            ) : (
              <p className="mt-10 font-mono text-xs text-muted">
                Log in to see live counts — the board only shows real listings to
                signed-in accounts.
              </p>
            )}
          </div>

          <Board
            rows={isAuthenticated && !loading ? rows : []}
            emptyMessage={
              isAuthenticated
                ? "No roles posted yet — check back soon."
                : "Log in or sign up to see live openings."
            }
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-amber">
            The process
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink2 sm:text-3xl">
            Three stops from sign-up to offer
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-line bg-panel p-6 transition-colors hover:border-amber/30"
            >
              <span className="font-mono text-3xl font-semibold text-line">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink2">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest roles */}
      <section className="border-t border-line bg-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber">
                Departures
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink2 sm:text-3xl">
                Latest roles on the board
              </h2>
            </div>
            <Link
              to="/jobs"
              className="hidden font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-amber sm:block"
            >
              View all →
            </Link>
          </div>

          {!isAuthenticated ? (
            <div className="rounded-xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
              <p className="font-display text-lg text-ink2">Sign in to see open roles</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                This board only shows real listings to signed-in accounts —
                create one in a few seconds.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link to="/login" className="btn-ghost">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign up
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl border border-line bg-panel"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
              <p className="font-display text-lg text-ink2">No roles posted yet</p>
              <p className="mt-2 text-sm text-muted">
                Once a recruiter posts a job, it will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.slice(0, 6).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
