import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "runway.user";

function extractMessage(err, fallback) {
  return err?.response?.data?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const onUnauthorized = () => persist(null);
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async ({ fullname, email, phoneNumber, password, role }) => {
    try {
      const form = new FormData();
      form.append("fullname", fullname);
      form.append("email", email);
      form.append("phoneNumber", phoneNumber);
      form.append("password", password);
      form.append("role", role);
      const res = await api.post("/user/register", form);
      return { ok: true, message: res.data?.message || "Account created" };
    } catch (err) {
      return { ok: false, message: extractMessage(err, "Could not create account. Is the backend running?") };
    }
  };

  const login = async ({ email, password, role }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("role", role);
      const res = await api.post("/user/login", form);
      const u = res.data?.user;
      persist(u);
      return { ok: true, message: res.data?.message || "Welcome back", user: u };
    } catch (err) {
      return { ok: false, message: extractMessage(err, "Could not log in. Is the backend running?") };
    }
  };

  const logout = async () => {
    try {
      await api.get("/user/logout");
    } catch {
      // even if the call fails, clear the local session
    }
    persist(null);
  };

  const updateProfile = async ({ fullname, email, phoneNumber, bio, skills }) => {
    try {
      const res = await api.post(
        "/user/profile/update",
        { fullname, email, phoneNumber, bio, skills },
        { headers: { "Content-Type": "application/json" } }
      );
      const updated = res.data?.safeUser;
      if (updated) persist({ ...user, ...updated });
      return { ok: true, message: res.data?.message || "Profile updated" };
    } catch (err) {
      return { ok: false, message: extractMessage(err, "Could not update profile.") };
    }
  };

  const value = {
    user,
    ready,
    isAuthenticated: !!user,
    role: user?.role || null,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
