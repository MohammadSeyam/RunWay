import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios.js";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { initials } from "../../lib/utils.js";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/company/get")
      .then((res) => setCompanies(res.data?.companies || []))
      .catch(() => setError("Couldn't load your companies."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber">Recruiter</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">Your companies</h1>
          <p className="mt-2 text-sm text-muted">
            Register a company before posting roles under it.
          </p>
        </div>
        <Link to="/recruiter/companies/new" className="btn-primary">
          + Add company
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading companies" />
      ) : error ? (
        <EmptyState title="Board offline" subtitle={error} />
      ) : companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          subtitle="Register your first company to start posting roles."
          action={
            <Link to="/recruiter/companies/new" className="btn-primary mt-2">
              Register a company
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <Link
              key={c._id}
              to={`/recruiter/companies/${c._id}/edit`}
              state={{ company: c }}
              className="card flex items-start gap-4 transition-colors hover:border-amber/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-panel2 font-mono text-sm text-amber">
                {initials(c.name) || "C"}
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-semibold text-ink2">
                  {c.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {c.description || "No description yet — click to add one."}
                </p>
                {c.location && (
                  <p className="mt-2 font-mono text-[11px] text-muted">{c.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
