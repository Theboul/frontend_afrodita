
interface Filtro {
  nombre: string;
  imagen: string;
}

interface FiltrarBusquedasProps {
  onFiltrar: (categoria: string) => void;
}

const filtrosSuperiores: Filtro[] = [
  {
    nombre: "Lentes",
    imagen: "/assets/Lentes.png",
  },
  {
    nombre: "Liquido",
    imagen: "/assets/Liquido.png",
  },
  {
    nombre: "Estuche",
    imagen: "/assets/Accesorios.jpg",
  },
];

const filtrosInferiores: Filtro[] = [
  {
    nombre: "Miel",
    imagen: "/assets/Miel.jpg",
  },
  {
    nombre: "Grises",
    imagen: "/assets/Grises.webp",
  },
    {
    nombre: "Verdes",
    imagen: "/assets/Verdes.jpg",
  },
  {
    nombre: "Celestes",
    imagen: "/assets/Celestes.jpg",
  },
];

export default function FiltrarBusquedas({ onFiltrar }: FiltrarBusquedasProps) {
  return (
    <div className="flex flex-col items-center gap-20 p-6">
      {/* Fila superior - redondos */}
      <div className="flex justify-center gap-20 flex-wrap">
        {filtrosSuperiores.map((filtro) => (
          <button
            key={filtro.nombre}
            onClick={() => onFiltrar(filtro.nombre.toLowerCase())}
            className="flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
          >
            <img
              src={filtro.imagen}
              alt={filtro.nombre}
              className="w-24 h-24 rounded-full object-cover border-2 border-transparent hover:border-purple-400 shadow-md"
            />
            <span className="mt-2 text-gray-700 font-semibold">
              {filtro.nombre}
            </span>
          </button>
        ))}
      </div>

      {/* Fila inferior - rectangulares */}
      <div className="flex justify-center gap-6 flex-wrap">
        {filtrosInferiores.map((filtro) => (
          <button
            key={filtro.nombre}
            onClick={() => onFiltrar(filtro.nombre.toLowerCase())}
            className="flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
          >
            <img
              src={filtro.imagen}
              alt={filtro.nombre}
              className="w-40 h-40 rounded-xl object-cover border-2 border-transparent hover:border-purple-400 shadow-md"
            />
            <span className="mt-2 font-semibold text-purple-600">
              {filtro.nombre}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}