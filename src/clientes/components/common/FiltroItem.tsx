import { useState } from "react";

interface FiltroItemProps {
  nombre: string;
  imagen: string;
  onClick: () => void;
  tipo?: "redondo" | "rectangular";
}

export default function FiltroItem({ nombre, imagen, onClick, tipo = "rectangular" }: FiltroItemProps) {
  const [imageError, setImageError] = useState(false);

  const clasesImagen =
    tipo === "redondo"
      ? "w-24 h-24 rounded-full"
      : "w-40 h-40 rounded-xl";

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
    >
      {imageError ? (
        <div className={`${clasesImagen} bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center border-2 border-transparent hover:border-purple-400 shadow-md`}>
          <span className="text-white font-bold text-lg">{nombre.charAt(0)}</span>
        </div>
      ) : (
        <img
          src={imagen}
          alt={nombre}
          onError={() => setImageError(true)}
          className={`${clasesImagen} object-cover border-2 border-transparent hover:border-purple-400 shadow-md`}
        />
      )}
      <span className="mt-2 font-semibold text-purple-600">{nombre}</span>
    </button>
  );
}