import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showHeaderCard?: boolean;
  showSnapshot?: boolean;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  children,
  actions,
  showHeaderCard = true,
  showSnapshot = true,
}) => {
  const location = useLocation();
  const { totalTasks, pendingTasks, completedTasks, categories } = useDashboard();

  const navItems = [
    { label: "Overview", href: "/dashboard", count: totalTasks },
    { label: "Tasks", href: "/dashboard/tasks", count: pendingTasks },
    { label: "Lists", href: "/dashboard/lists", count: categories.length },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(186,230,253,0.4),_transparent_35%),linear-gradient(to_bottom_right,_var(--color-blue-50),_white,_var(--color-sky-100))] px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-main-200 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-main-500">
              Workspace
            </p>
            <h2 className="mt-3 text-2xl font-bold text-main-700">
              Stay in control
            </h2>
            <p className="mt-2 text-sm leading-7 text-main-500">
              Move through your tasks one clear step at a time instead of handling everything in one crowded screen.
            </p>
          </div>

          <div className="rounded-[2rem] border border-main-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
              Dashboard
            </p>
            <div className="mt-3 space-y-2">
              {navItems.map((item) => {
                const active = location.pathname === item.href;

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

          {showSnapshot && (
            <div className="rounded-[2rem] border border-main-300 bg-gradient-to-br from-main-800 via-main-700 to-main-600 p-5 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                Snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/16 px-3 py-3 shadow-md shadow-black/10 backdrop-blur-md">
                  <p className="text-xs text-white/75">Completed</p>
                  <p className="mt-2 text-3xl font-bold text-white">{completedTasks}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/16 px-3 py-3 shadow-md shadow-black/10 backdrop-blur-md">
                  <p className="text-xs text-white/75">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-white">{pendingTasks}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="space-y-6">
          {showHeaderCard && (
            <div className="rounded-[2rem] border border-main-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="mt-2 text-3xl font-bold text-main-700 sm:text-4xl">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-main-500">
                    {description}
                  </p>
                </div>
                {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
