import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios.js";
import { useToast } from "../../context/ToastContext.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { initials, timeAgo } from "../../lib/utils.js";

const STATUSES = ["pending", "accepted", "rejected"];

export default function Applicants() {
  const { jid } = useParams();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jid]);

  function load() {
    setLoading(true);
    api
      .get(`/application/getapplicants/${jid}`)
      .then((res) => setJob(res.data?.job || null))
      .catch(() => setError("Couldn't load applicants for this role."))
      .finally(() => setLoading(false));
  }

  const handleStatus = async (applicationId, status) => {
    setUpdating(applicationId);
    try {
      const res = await api.put(`/application/updateStatus/${applicationId}`, { status });
      toast.success(res.data?.message || "Status updated");
      setJob((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a._id === applicationId ? { ...a, status } : a
        ),
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner label="Loading applicants" />;
  if (error || !job)
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState title="Role not found" subtitle={error} />
      </div>
    );

  const applications = job.applications || [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <Link to="/recruiter/jobs" className="text-sm text-muted hover:text-amber">
        ← Back to manage jobs
      </Link>

      <div className="mt-4 mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">Applicants</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">{job.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {applications.length} applicant{applications.length === 1 ? "" : "s"} for this role
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          subtitle="Once a student applies, they'll show up here."
        />
      ) : (
        <ul className="space-y-3">
          {applications.map((a) => {
            const applicant = a.applicant || {};
            const profile = applicant.profile || {};
            return (
              <li key={a._id} className="card flex flex-wrap items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-panel2 font-mono text-sm text-amber">
                  {initials(applicant.fullname) || "U"}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-ink2">
                      {applicant.fullname || "Applicant"}
                    </h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted">
                    {applicant.email} · {applicant.phoneNumber}
                  </p>
                  {profile.bio && <p className="mt-2 text-sm text-muted">{profile.bio}</p>}
                  {profile.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.skills.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-line bg-panel2 px-2 py-0.5 text-[11px] text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-muted/70">
                    Applied {timeAgo(a.createdAt)}
                  </p>
                </div>

                <select
                  value={a.status}
                  disabled={updating === a._id}
                  onChange={(e) => handleStatus(a._id, e.target.value)}
                  className="input w-auto shrink-0 capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
