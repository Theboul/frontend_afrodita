import { useEffect, useState } from "react";
import { CategoriaService } from "../../services/categorias/categoriaService";

interface Estadisticas {
  total: number;
  principales: number;
  sin_productos: number;
  nivel_maximo: number;
}

export default function EstadisticasCategorias() {
  const [data, setData] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await CategoriaService.estadisticas();
        setData(res.data);
      } catch {
        setError("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
        Cargando estadísticas...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center py-6 sm:py-8 text-red-500 text-sm sm:text-base">
        {error ?? "No se pudieron obtener las estadísticas."}
      </div>
    );
  }

  const cards = [
    {
      label: "Total de Categorías",
      value: data.total,
      color: "bg-pink-100 text-pink-700",
      icon: "📊",
    },
    {
      label: "Categorías Principales",
      value: data.principales,
      color: "bg-indigo-100 text-indigo-700",
      icon: "📁",
    },
    {
      label: "Sin Productos",
      value: data.sin_productos,
      color: "bg-yellow-100 text-yellow-700",
      icon: "⚠️",
    },
    {
      label: "Nivel Máximo",
      value: data.nivel_maximo,
      color: "bg-green-100 text-green-700",
      icon: "📈",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-3 sm:p-4 rounded-lg shadow-sm text-center font-semibold ${card.color}`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl">{card.icon}</span>
            <div className="text-2xl sm:text-3xl font-bold">{card.value}</div>
          </div>
          <div className="text-xs sm:text-sm mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
