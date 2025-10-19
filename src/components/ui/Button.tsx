// components/ui/Button.tsx
interface ButtonProps {
  label: string;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // 🆕 Agregar esta línea
}

const colorMap = {
  primary: "bg-pink-500 hover:bg-pink-600",
  success: "bg-green-600 hover:bg-green-700", 
  warning: "bg-yellow-500 hover:bg-yellow-600",
  danger: "bg-red-500 hover:bg-red-600",
  info: "bg-blue-500 hover:bg-blue-600",
};

const disabledStyles = "bg-gray-400 cursor-not-allowed";

export default function Button({ 
  label, 
  color = "primary", 
  onClick, 
  disabled = false,
  type = "button" // 🆕 Valor por defecto
}: ButtonProps) {
  return (
    <button
      type={type} // 🆕 Agregar esta línea
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        text-white px-4 py-2 rounded-md transition
        ${disabled ? disabledStyles : colorMap[color]}
      `}
    >
      {label}
    </button>
  );
}