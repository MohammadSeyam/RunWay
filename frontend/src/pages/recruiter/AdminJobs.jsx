import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios.js";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { formatSalary, timeAgo } from "../../lib/utils.js";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/job/getadminjobs")
      .then((res) => setJobs(res.data?.jobs || []))
      .catch(() => setError("Couldn't load your jobs."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber">Recruiter</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">Manage jobs</h1>
          <p className="mt-2 text-sm text-muted">Roles you've posted, and who's applied.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn-primary">
          + Post a role
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading jobs" />
      ) : error ? (
        <EmptyState title="Board offline" subtitle={error} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No roles posted yet"
          subtitle="Post your first role to start collecting applicants."
          action={
            <Link to="/recruiter/jobs/new" className="btn-primary mt-2">
              Post a role
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel2 font-mono text-[11px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Role</th>
                <th className="hidden px-5 py-3 sm:table-cell">Company</th>
                <th className="hidden px-5 py-3 md:table-cell">Salary</th>
                <th className="hidden px-5 py-3 md:table-cell">Posted</th>
                <th className="px-5 py-3 text-right">Applicants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-panel">
              {jobs.map((job) => (
                <tr key={job._id} className="transition-colors hover:bg-panel2/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink2">{job.title}</p>
                    <p className="font-mono text-xs text-muted">{job.location}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-muted sm:table-cell">
                    {job.company?.name || "—"}
                  </td>
                  <td className="hidden px-5 py-4 font-mono text-xs text-muted md:table-cell">
                    {formatSalary(job.salary)}
                  </td>
                  <td className="hidden px-5 py-4 font-mono text-xs text-muted md:table-cell">
                    {timeAgo(job.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-amber transition-colors hover:border-amber/40"
                    >
                      {job.applications?.length || 0} applied →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
