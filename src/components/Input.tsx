import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = "",
  id,
  ...props
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className={`min-w-0 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-main-700"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`
          rounded-lg border px-4 py-2
          min-w-0 w-full
          transition duration-200
          focus:outline-none focus:ring-2 focus:ring-main-400
          disabled:cursor-not-allowed disabled:bg-main-100
          ${error ? "border-red-500 focus:ring-red-500" : "border-main-300 bg-white text-main-700"}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
