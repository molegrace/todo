import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Alert from "./Alert";
import { useDashboard } from "../context/DashboardContext";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { logoutUser, getLogoutErrorMessage } from "../services/auth/logoutService";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showHeaderCard?: boolean;
};

const buildInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  children,
  actions,
  showHeaderCard = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { banner, setBanner } = useDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName?.trim() || null;
  const email = user?.email?.trim() || null;
  const avatarLabel = useMemo(
    () => buildInitials(displayName ?? email ?? "Profile"),
    [displayName, email]
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setIsProfileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      setLogoutError(getLogoutErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent_35%),linear-gradient(to_bottom_right,var(--color-blue-50),white,var(--color-sky-100))]">
      {/* Full height sidebar from top of the page */}
      <aside className="hidden h-full w-72 shrink-0 border-r border-main-300 bg-main-100 shadow-sm xl:block">
        <DashboardSidebar activePath={location.pathname} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 xl:hidden">
          <aside className="h-full w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border-r border-main-300 bg-main-100 shadow-2xl">
            <div className="flex justify-end p-4 pb-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close dashboard menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-main-300 bg-white text-xl font-semibold text-main-700 shadow-sm transition hover:bg-main-50"
              >
                ✕
              </button>
            </div>
            <DashboardSidebar activePath={location.pathname} />
          </aside>
        </div>
      )}

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header: Clean, borderless, no [TD Dashboard] logo, top-right Avatar icon */}
        <header className="flex h-16 shrink-0 w-full items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open mobile menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-main-200 bg-white text-main-700 shadow-sm transition hover:bg-main-50 xl:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-expanded={isProfileMenuOpen}
              aria-label="Open profile menu"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-main-700 font-bold text-white shadow-md ring-2 ring-main-200 transition duration-300 hover:scale-105 hover:ring-main-400 focus:outline-none"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLabel
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="navbar-menu-enter absolute right-0 top-14 z-50 flex w-64 max-w-[calc(100vw-1.5rem)] flex-col rounded-3xl border border-main-200 bg-white p-4 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-main-100 pb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-main-700 text-xs font-bold text-white shadow-sm">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarLabel
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-main-700">
                      {displayName ?? "User Profile"}
                    </p>
                    <p className="truncate text-xs text-main-500">{email ?? "Signed in"}</p>
                  </div>
                </div>

                {logoutError && (
                  <div className="mt-2 rounded-xl bg-red-50 p-2 text-xs text-red-700" role="alert">
                    {logoutError}
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-1">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-main-700 transition hover:bg-main-100"
                  >
                    <svg className="h-4 w-4 text-main-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Manage Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-2 sm:px-6 sm:pb-6">
          <div className="max-w-7xl space-y-4 sm:space-y-6">
            {showHeaderCard && (Boolean(title) || Boolean(actions) || Boolean(description)) && (
              <div className="py-2">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    {title && (
                      <h1 className="break-words text-3xl font-bold text-main-700 sm:text-4xl">
                        {title}
                      </h1>
                    )}
                    {description && (
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-main-500">
                        {description}
                      </p>
                    )}
                  </div>
                  {actions && <div className="flex w-full flex-wrap gap-3 sm:w-auto">{actions}</div>}
                </div>
              </div>
            )}

            {banner && (
              <div className="flex items-start justify-between gap-3 rounded-2xl">
                <div className="flex-1">
                  <Alert message={banner.message} type={banner.type} />
                </div>
                <button
                  type="button"
                  onClick={() => setBanner(null)}
                  className="rounded-xl border border-main-200 bg-white px-3 py-2 text-sm font-medium text-main-600 shadow-sm transition hover:bg-main-50 hover:text-main-700"
                  aria-label="Dismiss message"
                >
                  Close
                </button>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
