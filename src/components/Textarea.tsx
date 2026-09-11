import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const Textarea: React.FC<TextareaProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-main-700">{label}</label>}
      <textarea
        className={`w-full rounded-none border-0 border-b border-main-300 bg-transparent px-1 py-2 text-main-700 transition duration-200 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-main-700 ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Textarea;
