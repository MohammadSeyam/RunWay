import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Logo from "../ui/Logo.jsx";
import { initials } from "../../lib/utils.js";

function NavItem({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-1 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-amber" : "text-muted hover:text-ink2"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute -bottom-0.5 left-0 h-px w-full bg-amber transition-transform origin-left ${
              isActive ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          <NavItem to="/" end>
            Home
          </NavItem>
          <NavItem to="/jobs">Browse jobs</NavItem>
          {role === "recruiter" && (
            <>
              <NavItem to="/recruiter/companies">Companies</NavItem>
              <NavItem to="/recruiter/jobs">Manage jobs</NavItem>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-muted transition-colors hover:text-ink2"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-md bg-amber px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-amber-soft"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm text-ink2 transition-colors hover:border-amber/40"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15 font-mono text-[11px] text-amber">
                  {initials(user?.fullname) || "U"}
                </span>
                {user?.fullname?.split(" ")[0]}
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-md border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-coral/50 hover:text-coral"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <NavItem to="/" end>
              Home
            </NavItem>
            <NavItem to="/jobs">Browse jobs</NavItem>
            {role === "recruiter" && (
              <>
                <NavItem to="/recruiter/companies">Companies</NavItem>
                <NavItem to="/recruiter/jobs">Manage jobs</NavItem>
              </>
            )}
            {isAuthenticated && <NavItem to="/profile">Profile</NavItem>}
            <div className="mt-2 flex gap-3">
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md border border-line py-2 text-center text-sm text-ink2"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md bg-amber py-2 text-center text-sm font-semibold text-ink"
                  >
                    Sign up
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-md border border-line py-2 text-center text-sm text-coral"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
