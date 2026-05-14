import React, { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent_35%),linear-gradient(to_bottom_right,var(--color-blue-50),white,var(--color-sky-100))] pl-3 sm:h-[calc(100dvh-4.5rem)] sm:pl-6">
      <div className="grid h-full w-full min-w-0 gap-4 overflow-hidden sm:gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden min-w-0 space-y-5 py-4 sm:py-6 xl:block xl:self-start">
          <DashboardSidebar activePath={location.pathname} />
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 sm:top-[4.5rem] xl:hidden">
            <aside className="h-full w-[min(22rem,calc(100vw-2rem))] overflow-y-auto bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close dashboard menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-main-200 bg-white text-xl font-semibold text-main-700 shadow-sm transition hover:bg-main-50"
                >
                  x
                </button>
              </div>
              <DashboardSidebar activePath={location.pathname} />
            </aside>
          </div>
        )}
 
        <main className="min-h-0 min-w-0 overflow-y-auto">
          <div className="max-w-[calc(80rem-280px-1.5rem)] space-y-4 py-4 pr-3 sm:space-y-6 sm:py-6 sm:pr-6 xl:pr-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl border border-main-200 bg-white/90 px-4 py-3 text-sm font-semibold text-main-700 shadow-sm transition hover:bg-main-50 xl:hidden"
            >
              <span>Dashboard menu</span>
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
