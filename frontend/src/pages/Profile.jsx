import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field } from "./Login.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { initials, timeAgo } from "../lib/utils.js";

export default function Profile() {
  const { user, role, updateProfile } = useAuth();
  const toast = useToast();
  const profile = user?.Profile || {};

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: profile.bio || "",
    skills: (profile.skills || []).join(", "),
  });
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile(form);
    setSaving(false);
    res.ok ? toast.success(res.message) : toast.error(res.message);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel2 font-mono text-lg text-amber">
          {initials(user?.fullname) || "U"}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink2">{user?.fullname}</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {role} account
          </p>
        </div>
        {role === "recruiter" && (
          <Link to="/recruiter/companies" className="btn-ghost ml-auto">
            Go to dashboard →
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={handleSave} className="card h-fit space-y-1">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink2">
            Account details
          </h2>

          <Field label="Full name">
            <input value={form.fullname} onChange={update("fullname")} className="input" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={update("email")} className="input" />
          </Field>
          <Field label="Phone number">
            <input value={form.phoneNumber} onChange={update("phoneNumber")} className="input" />
          </Field>
          <Field label="Bio">
            <textarea
              value={form.bio}
              onChange={update("bio")}
              rows={3}
              placeholder="A short line about you"
              className="input resize-none"
            />
          </Field>
          <Field label="Skills (comma separated)">
            <input
              value={form.skills}
              onChange={update("skills")}
              placeholder="React, Node.js, MongoDB"
              className="input"
            />
          </Field>

          <button type="submit" disabled={saving} className="btn-primary mt-2 w-full">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        {role === "student" ? (
          <AppliedJobs />
        ) : (
          <div className="card">
            <h2 className="font-display text-lg font-semibold text-ink2">Recruiter tools</h2>
            <p className="mt-2 text-sm text-muted">
              Manage your companies, post new roles, and review applicants from the
              recruiter dashboard.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/recruiter/companies" className="btn-ghost">
                Companies
              </Link>
              <Link to="/recruiter/jobs" className="btn-ghost">
                Manage jobs
              </Link>
              <Link to="/recruiter/jobs/new" className="btn-primary">
                Post a role
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppliedJobs() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/application/getappliedjobs")
      .then((res) => setItems(res.data?.appliedJobs || []))
      .catch(() => setError("Couldn't load your applications."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink2">Your applications</h2>
      {loading ? (
        <Spinner label="Loading" />
      ) : error ? (
        <p className="text-sm text-coral">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No applications yet"
          subtitle="Roles you apply to will show up here with live status."
        />
      ) : (
        <ul className="divide-y divide-line">
          {items.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link
                  to={a.job?._id ? `/jobs/${a.job._id}` : "#"}
                  className="truncate font-medium text-ink2 hover:text-amber"
                >
                  {a.job?.title || "Role removed"}
                </Link>
                <p className="truncate font-mono text-xs text-muted">
                  {a.job?.company?.name || "Company"} · applied {timeAgo(a.createdAt)}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
