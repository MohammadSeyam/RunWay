import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true, // backend auth relies on the httpOnly-ish "token" cookie
  timeout: 15000,
});

// Most read routes on this backend (jobs, companies, applications) require a
// logged-in session. If a request comes back 401 — no session, or an expired
// one — broadcast it so the app can clear local auth state and send the
// person to log in, instead of every page inventing its own "offline" message.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(err);
  }
);

export default api;
