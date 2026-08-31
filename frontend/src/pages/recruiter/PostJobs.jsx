import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios.js";
import { useToast } from "../../context/ToastContext.jsx";
import { Field } from "../Login.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];

export default function PostJob() {
  const toast = useToast();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: JOB_TYPES[0],
    experience: "",
    position: "1",
    companyId: "",
  });

  useEffect(() => {
    api
      .get("/company/get")
      .then((res) => {
        const list = res.data?.companies || [];
        setCompanies(list);
        if (list[0]) setForm((f) => ({ ...f, companyId: list[0]._id }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/job/post", form);
      toast.success(res.data?.message || "Job posted");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not post this role.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading" />;

  if (companies.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <EmptyState
          title="Register a company first"
          subtitle="Every role needs a company attached to it. Add one, then come back to post."
          action={
            <Link to="/recruiter/companies/new" className="btn-primary mt-2">
              Register a company
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-amber">New departure</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">Post a role</h1>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-1">
        <Field label="Company">
          <select value={form.companyId} onChange={update("companyId")} className="input" required>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Job title">
          <input
            required
            value={form.title}
            onChange={update("title")}
            placeholder="Frontend Engineer"
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={update("description")}
            placeholder="What will this person do day to day?"
            className="input resize-none"
          />
        </Field>

        <Field label="Requirements (comma separated)">
          <input
            required
            value={form.requirements}
            onChange={update("requirements")}
            placeholder="React, JavaScript, CSS"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Job type">
            <select value={form.jobType} onChange={update("jobType")} className="input">
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <input
              required
              value={form.location}
              onChange={update("location")}
              placeholder="Dhaka, Bangladesh"
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Salary">
            <input
              required
              type="number"
              min="0"
              value={form.salary}
              onChange={update("salary")}
              placeholder="50000"
              className="input"
            />
          </Field>
          <Field label="Experience (yrs)">
            <input
              required
              type="number"
              min="0"
              value={form.experience}
              onChange={update("experience")}
              placeholder="2"
              className="input"
            />
          </Field>
          <Field label="Openings">
            <input
              required
              type="number"
              min="1"
              value={form.position}
              onChange={update("position")}
              className="input"
            />
          </Field>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
          {submitting ? "Posting…" : "Post role"}
        </button>
      </form>
    </div>
  );
}
