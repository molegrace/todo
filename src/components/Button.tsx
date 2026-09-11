import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
}

const baseStyle =
  "inline-flex min-w-0 items-center justify-center rounded-xl px-4 py-2 text-center font-medium transition focus:outline-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border border-main-300 bg-main-100 text-main-700 hover:bg-main-200 hover:border-main-400 shadow-sm",
  secondary: "border border-main-200 bg-main-50 text-main-700 hover:bg-main-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
