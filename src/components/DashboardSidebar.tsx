import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { getLogoutErrorMessage, logoutUser } from "../services/auth/logoutService";

type DashboardSidebarProps = {
  activePath: string;
};

const buildInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activePath }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    totalTasks,
    pendingTasks,
    categories,
  } = useDashboard();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const displayName = user?.displayName?.trim() || null;
  const email = user?.email?.trim() || null;
  const avatarLabel = useMemo(
    () => buildInitials(displayName ?? email ?? "Profile"),
    [displayName, email]
  );

  const navItems = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", count: totalTasks },
      { label: "Tasks", href: "/dashboard/tasks", count: pendingTasks },
      { label: "Categories", href: "/dashboard/lists", count: categories.length },
    ],
    [categories.length, pendingTasks, totalTasks]
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      setLogoutError(getLogoutErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-5">
            <div className="rounded-4xl border border-main-200 bg-white/95 p-5 text-main-600 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
          Profile
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main-700 text-sm font-bold text-white shadow-sm">
            {avatarLabel}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-main-700">
              {displayName ?? "Your profile"}
            </p>
            <p className="truncate text-xs text-main-500">{email ?? "Signed in"}</p>
          </div>
        </div>

        {logoutError && (
          <p className="mt-3 text-xs text-red-700" role="alert">
            {logoutError}
          </p>
        )}

        <div className="mt-4 grid gap-2">
          <Link
            to="/dashboard/profile"
            className="rounded-2xl border border-main-200 bg-white px-4 py-2 text-center text-sm font-medium text-main-700 shadow-sm transition hover:bg-main-50"
          >
            Manage profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-2xl border border-main-200 bg-main-100 px-4 py-2 text-sm font-medium text-main-700 shadow-sm transition hover:bg-main-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className="rounded-4xl border border-main-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
          Dashboard

        </p>
        <div className="mt-3 space-y-2">
          {navItems.map((item) => {
            const active = activePath === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-main-700 text-white shadow-sm"
                    : "text-main-600 hover:bg-main-100"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-white/20 text-white" : "bg-main-100 text-main-500"
                  }`}
                >
                  {item.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>


    </div>
  );
};

export default DashboardSidebar;

