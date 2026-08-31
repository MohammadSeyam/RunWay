import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(form);
    setSubmitting(false);
    if (res.ok) {
      toast.success(res.message);
      const dest = location.state?.from || (form.role === "recruiter" ? "/recruiter/jobs" : "/jobs");
      navigate(dest, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-5 py-16">
      <div className="mx-auto w-full max-w-md">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-amber">
          Welcome back
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold text-ink2">
          Log in to Runway
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-line bg-panel p-6 shadow-board sm:p-8"
        >
          <RoleToggle value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />

          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className="input"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              className="input"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-md bg-amber py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber-soft disabled:opacity-60"
          >
            {submitting ? "Checking in…" : "Log in"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            New to Runway?{" "}
            <Link to="/signup" className="text-amber hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function RoleToggle({ value, onChange }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-line bg-panel2 p-1">
      {["student", "recruiter"].map((r) => (
        <button
          type="button"
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-md py-2 text-sm font-medium capitalize transition-colors ${
            value === r ? "bg-amber text-ink" : "text-muted hover:text-ink2"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
