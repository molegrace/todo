import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "underline";
  passwordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  variant = "underline",
  passwordToggle = false,
  className = "",
  id,
  type,
  ...props
}, ref) => {
  const inputId = id || props.name;
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const inputStyle =
    variant === "outlined"
      ? `
          rounded-lg border border-main-300 bg-white px-3 py-2 text-main-700
          focus:outline-none focus:ring-0 focus:border-main-600
          disabled:bg-main-100
          ${error ? "border-red-500" : ""}
        `
      : `
          rounded-none border-0 border-b border-main-300 bg-transparent px-1 py-2 text-main-700
          focus:outline-none focus:ring-0 focus:border-b-2 focus:border-main-700
          disabled:bg-transparent
          ${error ? "border-red-500 focus:border-red-500" : ""}
        `;

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

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={passwordToggle && isPasswordVisible ? "text" : type}
          className={`
            min-w-0 w-full
            transition duration-200
            focus:outline-none focus:ring-0
            disabled:cursor-not-allowed
            ${passwordToggle ? "pr-11" : ""}
            ${inputStyle}
            ${className}
          `}
          {...props}
        />

        {passwordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-main-500 transition hover:text-main-700 focus:outline-none"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m3 3 18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.3 4.1 9.5 6-0.5.8-1.4 2.1-2.8 3.3" />
                <path d="M6.2 6.2C4.1 7.6 2.8 9.4 2.5 10c1.2 1.9 4.5 6 9.5 6 1.2 0 2.3-.2 3.3-.6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
