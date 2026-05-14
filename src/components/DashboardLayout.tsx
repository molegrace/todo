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
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent_35%),linear-gradient(to_bottom_right,var(--color-blue-50),white,var(--color-sky-100))] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-4 sm:gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-5">
          <DashboardSidebar activePath={location.pathname} />
        </aside>

        <main className="min-w-0 space-y-4 sm:space-y-6">
          {showHeaderCard && (
            <div className="rounded-3xl border border-main-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:rounded-4xl sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <h1 className="mt-2 break-words text-3xl font-bold text-main-700 sm:text-4xl">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-main-500">
                    {description}
                  </p>
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
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
