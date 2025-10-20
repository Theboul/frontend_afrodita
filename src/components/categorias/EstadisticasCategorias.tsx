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
      <div className="flex justify-center items-center py-4 text-gray-500">
        Cargando estadísticas...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center py-4 text-red-500">
        {error ?? "No se pudieron obtener las estadísticas."}
      </div>
    );
  }

  const cards = [
    {
      label: "Total de Categorías",
      value: data.total,
      color: "bg-pink-100 text-pink-700",
    },
    {
      label: "Categorías Principales",
      value: data.principales,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Sin Productos",
      value: data.sin_productos,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Nivel Máximo",
      value: data.nivel_maximo,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-4 rounded-lg shadow-sm text-center font-semibold ${card.color}`}
        >
          <div className="text-3xl font-bold">{card.value}</div>
          <div className="text-sm mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
