import React from "react";
import FiltroItem from "./FiltroItem";

interface Filtro {
  nombre: string;
  imagen: string;
}

interface FiltrarBusquedasProps {
  onFiltrar: (categoria: string) => void;
}



const filtrosSuperiores: Filtro[] = [
  { nombre: "Lentes", imagen: "../../../../public/assets/Lentes.png" },
  { nombre: "Liquidos", imagen: "../../../../public/assets/Liquido.png" },
  { nombre: "Accesorios", imagen: "../../../../public/assets/Accesorios.jpg" },
];

const filtrosInferiores: Filtro[] = [
  { nombre: "Mieles", imagen: "../../../../public/assets/Miel.jpg" },
  { nombre: "Grises", imagen: "../../../../public/assets/Grises.webp" },
  { nombre: "Verdes", imagen: "../../../../public/assets/Verdes.jpg" },
  { nombre: "Celestes", imagen: "../../../../public/assets/Celestes.jpg" },
];

export default function FiltrarBusquedas({ onFiltrar }: FiltrarBusquedasProps) {
  return (
    <div className="flex flex-col items-center gap-20 p-6">
      {/* Fila superior */}
      <div className="flex justify-center gap-20 flex-wrap">
        {filtrosSuperiores.map((filtro) => (
          <FiltroItem
            key={filtro.nombre}
            nombre={filtro.nombre}
            imagen={filtro.imagen}
            tipo="redondo"
            onClick={() => onFiltrar(filtro.nombre.toLowerCase())}
          />
        ))}
      </div>

      {/* Fila inferior */}
      <div className="flex justify-center gap-6 flex-wrap">
        {filtrosInferiores.map((filtro) => (
          <FiltroItem
            key={filtro.nombre}
            nombre={filtro.nombre}
            imagen={filtro.imagen}
            tipo="rectangular"
            onClick={() => onFiltrar(filtro.nombre.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
}