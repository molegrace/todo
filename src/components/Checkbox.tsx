import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-main-600">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-main-300 text-main-600 focus:ring-main-400"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
