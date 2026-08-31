import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios.js";
import { useToast } from "../../context/ToastContext.jsx";
import { Field } from "../Login.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

export default function CompanyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit && !location.state?.company);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [form, setForm] = useState({ name: "", description: "", website: "", location: "" });

  useEffect(() => {
    if (!isEdit) return;
    if (location.state?.company) {
      hydrate(location.state.company);
      return;
    }
    // Fallback for a direct page load / refresh: list endpoint works reliably,
    // so we pull the company out of the full list instead of a by-id lookup.
    api
      .get("/company/get")
      .then((res) => {
        const found = (res.data?.companies || []).find((c) => c._id === id);
        if (found) hydrate(found);
        else toast.error("Company not found");
      })
      .catch(() => toast.error("Couldn't load this company."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function hydrate(c) {
    setForm({
      name: c.name || "",
      description: c.description || "",
      website: c.website || "",
      location: c.location || "",
    });
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/company/register", { companyName });
      const company = res.data?.company;
      toast.success(res.data?.message || "Company registered");
      navigate(`/recruiter/companies/${company._id}/edit`, {
        replace: true,
        state: { company },
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not register company.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/company/update/${id}`, form);
      toast.success(res.data?.message || "Company updated");
      navigate("/recruiter/companies");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update company.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading company" />;

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-amber">
        {isEdit ? "Edit company" : "New company"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink2">
        {isEdit ? form.name || "Edit company" : "Register a company"}
      </h1>

      {!isEdit ? (
        <form onSubmit={handleCreate} className="card mt-8">
          <p className="mb-4 text-sm text-muted">
            Give your company a name to get started — you can fill in the rest right
            after.
          </p>
          <Field label="Company name">
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              className="input"
            />
          </Field>
          <button type="submit" disabled={saving} className="btn-primary mt-2 w-full">
            {saving ? "Registering…" : "Register & continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} className="card mt-8">
          <Field label="Company name">
            <input value={form.name} onChange={update("name")} className="input" />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={4}
              placeholder="What does this company do?"
              className="input resize-none"
            />
          </Field>
          <Field label="Website">
            <input
              value={form.website}
              onChange={update("website")}
              placeholder="https://example.com"
              className="input"
            />
          </Field>
          <Field label="Location">
            <input
              value={form.location}
              onChange={update("location")}
              placeholder="Dhaka, Bangladesh"
              className="input"
            />
          </Field>
          <button type="submit" disabled={saving} className="btn-primary mt-2 w-full">
            {saving ? "Saving…" : "Save company"}
          </button>
        </form>
      )}
    </div>
  );
}
