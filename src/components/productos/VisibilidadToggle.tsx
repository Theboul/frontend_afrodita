import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface VisibilidadToggleProps {
  valor: "mostrar" | "ocultar" | null;
  onChange: (valor: "mostrar" | "ocultar" | null) => void;
}

export default function VisibilidadToggle({ valor, onChange }: VisibilidadToggleProps) {
  return (
    <div className="flex items-center gap-6 mb-8">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={valor === "mostrar"}
          onChange={() => onChange(valor === "mostrar" ? null : "mostrar")}
          className="accent-pink-400"
        />
        <MdVisibility className={`text-xl ${valor === "mostrar" ? "text-pink-500" : "text-gray-400"}`} />
        <span className={`${valor === "mostrar" ? "text-pink-600 font-medium" : "text-gray-600"}`}>
          Mostrar
        </span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={valor === "ocultar"}
          onChange={() => onChange(valor === "ocultar" ? null : "ocultar")}
          className="accent-pink-400"
        />
        <MdVisibilityOff className={`text-xl ${valor === "ocultar" ? "text-pink-500" : "text-gray-400"}`} />
        <span className={`${valor === "ocultar" ? "text-pink-600 font-medium" : "text-gray-600"}`}>
          Ocultar
        </span>
      </label>
    </div>
  );
}