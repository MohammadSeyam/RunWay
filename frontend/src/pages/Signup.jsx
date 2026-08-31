import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, RoleToggle } from "./Login.jsx";

export default function Signup() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (res.ok) {
      toast.success(res.message + " — now log in.");
      navigate("/login", { replace: true, state: {} });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-5 py-16">
      <div className="mx-auto w-full max-w-md">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-amber">
          Get started
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold text-ink2">
          Create your account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-line bg-panel p-6 shadow-board sm:p-8"
        >
          <RoleToggle value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />

          <Field label="Full name">
            <input
              required
              value={form.fullname}
              onChange={update("fullname")}
              placeholder="Jane Doe"
              className="input"
            />
          </Field>

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

          <Field label="Phone number">
            <input
              required
              value={form.phoneNumber}
              onChange={update("phoneNumber")}
              placeholder="017XXXXXXXX"
              className="input"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              placeholder="At least 6 characters"
              className="input"
            />
          </Field>

          <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-amber hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
