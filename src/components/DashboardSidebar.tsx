import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/todo2.png";
import { useDashboard } from "../context/DashboardContext";

type DashboardSidebarProps = {
  activePath: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activePath }) => {
  const { totalTasks, pendingTasks, categories } = useDashboard();

  const navItems = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", count: totalTasks },
      { label: "Tasks", href: "/dashboard/tasks", count: pendingTasks },
      { label: "Categories", href: "/dashboard/lists", count: categories.length },
    ],
    [categories.length, pendingTasks, totalTasks]
  );

  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-main-600">
      <div className="space-y-6">
        {/* Brand Header at top of sidebar */}
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white px-2 py-1 shadow-md ring-1 ring-main-200">
            <img
              src={logo}
              alt="Todo logo"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-blue-700 sm:text-lg">
              Todo App
            </h1>
            <p className="truncate text-xs text-main-500">Organize your day with ease</p>
          </div>
        </Link>

        {/* Clean Navigation Links */}
        <nav className="space-y-2 pt-2">
          {navItems.map((item) => {
            const active = activePath === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-main-200/80 text-main-800 font-bold"
                    : "text-main-700 hover:bg-main-200/80"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    active ? "bg-white/90 text-main-800" : "bg-white/80 text-main-700"
                  }`}
                >
                  {item.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
