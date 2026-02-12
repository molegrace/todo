
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
}

const baseStyle =
  "px-4 py-2 rounded font-medium transition focus:outline-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-green-400 text-white hover:bg-green-500",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
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

