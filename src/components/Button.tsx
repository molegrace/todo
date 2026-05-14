
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;

}

const baseStyle =
  "inline-flex min-w-0 items-center justify-center rounded px-4 py-2 text-center font-medium transition focus:outline-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-main-500 text-white hover:bg-main-600",
  secondary: "bg-main-100 text-main-700 hover:bg-main-200",
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

