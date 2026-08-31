import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { formatSalary, timeAgo } from "../lib/utils.js";

export default function JobDetails() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(`/job/get/${id}`)
      .then((res) => mounted && setJob(res.data?.job || null))
      .catch(() => mounted && setError("Couldn't load this role."))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || role !== "student") return;
    api
      .get("/application/getappliedjobs")
      .then((res) => {
        const list = res.data?.appliedJobs || [];
        setApplied(list.some((a) => a.job?._id === id));
      })
      .catch(() => {});
  }, [id, isAuthenticated, role]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }
    setApplying(true);
    try {
      const res = await api.post(`/application/apply/${id}`);
      toast.success(res.data?.message || "Applied successfully");
      setApplied(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not apply to this role.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner label="Loading role" />;
  if (error || !job)
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState title="Role not found" subtitle={error || "This role may have been removed."} />
      </div>
    );

  const reqs = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <Link to="/jobs" className="text-sm text-muted hover:text-amber">
        ← Back to board
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-panel shadow-board">
        <div className="border-b border-line bg-panel2 px-6 py-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-amber">
            {job.company?.name || "Company"}
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-semibold text-ink2 sm:text-3xl">
              {job.title}
            </h1>
            <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-amber">
              {job.jobType}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-muted">
            Posted {timeAgo(job.createdAt)}
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 md:grid-cols-[1fr_240px]">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink2">
              {job.description}
            </p>

            {reqs.length > 0 && (
              <>
                <h2 className="mt-6 font-display text-sm font-semibold uppercase tracking-widest text-muted">
                  Requirements
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {reqs.map((r, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-line bg-panel2 px-2.5 py-1 text-xs text-ink2"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4 rounded-xl border border-line bg-panel2 p-5">
            <Stat label="Salary" value={formatSalary(job.salary)} />
            <Stat label="Location" value={job.location} />
            <Stat label="Experience" value={`${job.experienceLevel ?? "—"} yrs`} />
            <Stat label="Openings" value={job.position} />

            {role !== "recruiter" && (
              <button
                onClick={handleApply}
                disabled={applied || applying}
                className="btn-primary mt-2 w-full disabled:cursor-not-allowed"
              >
                {applied ? "Applied ✓" : applying ? "Applying…" : "Apply now"}
              </button>
            )}
            {role === "recruiter" && (
              <p className="pt-1 text-center text-xs text-muted">
                Recruiter accounts can't apply to roles.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-0.5 font-display text-sm font-medium text-ink2">{value ?? "—"}</p>
    </div>
  );
}
