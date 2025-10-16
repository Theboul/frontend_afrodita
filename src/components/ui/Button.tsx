interface ButtonProps {
  label: string;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
}

const colorMap = {
  primary: "bg-pink-500 hover:bg-pink-600",
  success: "bg-green-600 hover:bg-green-700",
  warning: "bg-yellow-500 hover:bg-yellow-600",
  danger: "bg-red-500 hover:bg-red-600",
  info: "bg-blue-500 hover:bg-blue-600",
};

export default function Button({ label, color = "primary", onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${colorMap[color]} text-white px-4 py-2 rounded-md transition`}
    >
      {label}
    </button>
  );
}
