import { type ReactNode } from "react";

interface ButtonProps {
  label: string;
  color?: "info" | "success" | "danger" | "warning";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  label,
  color = "info",
  onClick,
  type = "button",
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const colorClasses = {
    info: "bg-blue-500 hover:bg-blue-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        flex items-center justify-center gap-2
        px-4 py-2 rounded-lg
        font-medium text-sm md:text-base
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colorClasses[color]}
      `}
    >
      {icon}
      {label}
    </button>
  );
}