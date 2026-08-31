import React, { useEffect, useState } from "react";
import api from "../lib/axios.js";
import JobCard from "../components/ui/JobCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function Jobs() {
  const [keyword, setKeyword] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      api
        .get("/job/get", { params: { keyword }, signal: controller.signal })
        .then((res) => setJobs(res.data?.jobs || []))
        .catch((err) => {
          if (err.code !== "ERR_CANCELED") {
            setError("Couldn't reach the backend. Make sure the server is running.");
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [keyword]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">Departures board</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">Browse open roles</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Search by title or description — the board updates as you type.
        </p>
      </div>

      <div className="relative mb-8 max-w-lg">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search titles or keywords…"
          className="input pl-10"
        />
      </div>

      {loading ? (
        <Spinner label="Scanning the board" />
      ) : error ? (
        <EmptyState title="Board offline" subtitle={error} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No roles match"
          subtitle="Try a different keyword, or check back soon — new roles board here first."
        />
      ) : (
        <>
          <p className="mb-4 font-mono text-xs text-muted">
            {jobs.length} role{jobs.length === 1 ? "" : "s"} on the board
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
