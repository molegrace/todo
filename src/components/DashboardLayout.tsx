import React from "react";
import { useLocation } from "react-router-dom";
import Alert from "./Alert";
import { useDashboard } from "../context/DashboardContext";
import DashboardSidebar from "./DashboardSidebar";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showHeaderCard?: boolean;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  children,
  actions,
  showHeaderCard = true,
}) => {
  const location = useLocation();
  const { banner, setBanner } = useDashboard();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent_35%),linear-gradient(to_bottom_right,var(--color-blue-50),white,var(--color-sky-100))] px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <DashboardSidebar activePath={location.pathname} />
        </aside>

        <main className="space-y-6">
          {showHeaderCard && (
            <div className="rounded-4xl border border-main-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
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
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
