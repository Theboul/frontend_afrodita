// src/components/dashboard/FiltrarBusquedas.tsx
import React from "react";

interface Props {
  categorias: { id_categoria: number; nombre: string }[];
  onFiltrar: (id: number) => void;
}

const FiltrarBusquedas: React.FC<Props> = ({ categorias, onFiltrar }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg flex flex-wrap gap-2 justify-center">
      {categorias.map((c) => (
        <button
          key={c.id_categoria}
          onClick={() => onFiltrar(c.id_categoria)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#C25B8C] hover:text-white transition"
        >
          {c.nombre}
        </button>
      ))}
    </div>
  );
};

export default FiltrarBusquedas;
