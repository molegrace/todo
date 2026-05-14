import React from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
};

const Select: React.FC<SelectProps> = ({ label, options, className = "", ...props }) => {
  return (
    <div className="flex min-w-0 w-full flex-col gap-1">
      {label && <label className="text-sm font-medium text-main-700">{label}</label>}
      <select
        className={`min-w-0 w-full rounded border border-main-300 bg-white px-3 py-2 text-main-700 focus:outline-none focus:ring-2 focus:ring-main-400 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
