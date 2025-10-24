import React from "react";

interface FiltroItemProps {
  nombre: string;
  imagen: string;
  onClick: () => void;
  tipo?: "redondo" | "rectangular";
}

export default function FiltroItem({ nombre, imagen, onClick, tipo = "rectangular" }: FiltroItemProps) {
  const clasesImagen =
    tipo === "redondo"
      ? "w-24 h-24 rounded-full"
      : "w-40 h-40 rounded-xl";

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
    >
      <img
        src={imagen}
        alt={nombre}
        className={`${clasesImagen} object-cover border-2 border-transparent hover:border-purple-400 shadow-md`}
      />
      <span className="mt-2 font-semibold text-purple-600">{nombre}</span>
    </button>
  );
}