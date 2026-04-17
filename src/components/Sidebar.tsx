import React from "react";

type SidebarItem = {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
};

type SidebarProps = {
  title?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
};

const Sidebar: React.FC<SidebarProps> = ({ title, items, footer }) => {
  return (
    <aside className="rounded-3xl border border-main-200 bg-white p-4 shadow-sm">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-main-500">
            {title}
          </h2>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={item.onClick}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition ${
                item.active
                  ? "bg-main-700 text-white shadow-sm"
                  : "text-main-600 hover:bg-main-100"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              {typeof item.count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    item.active
                      ? "bg-white/20 text-white"
                      : "bg-main-100 text-main-500"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-4">{footer}</div>}
    </aside>
  );
};

export default Sidebar;
