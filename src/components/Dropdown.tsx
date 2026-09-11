import React from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
  variant?: "outlined" | "underline";
};

const Select: React.FC<SelectProps> = ({
  label,
  options,
  variant = "underline",
  className = "",
  ...props
}) => {
  const selectStyle =
    variant === "outlined"
      ? "rounded-lg border border-main-300 bg-white px-3 py-2 text-main-700 focus:outline-none focus:ring-0 focus:border-main-600"
      : "rounded-none border-0 border-b border-main-300 bg-transparent px-1 py-2 text-main-700 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-main-700";

  return (
    <div className="flex min-w-0 w-full flex-col gap-1">
      {label && <label className="text-sm font-medium text-main-700">{label}</label>}
      <select
        className={`min-w-0 w-full transition duration-200 focus:outline-none focus:ring-0 ${selectStyle} ${className}`}
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
