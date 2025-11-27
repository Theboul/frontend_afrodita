// src/pages/devoluciones/MisDevoluciones.tsx
import { useEffect } from "react";
import { useDevolucionesStore } from "../../stores/devolucionesStore";

const MisDevoluciones: React.FC = () => {
  const { items, fetchMis, loading, error } = useDevolucionesStore();

  useEffect(() => {
    fetchMis();
  }, [fetchMis]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-2">
        Mis solicitudes de devolución / reembolso
      </h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <ul className="space-y-2">
        {items.map((d) => (
          <li
            key={d.id_devolucion_compra}
            className="border rounded p-2 text-sm bg-white"
          >
            <div className="flex justify-between">
              <span className="font-medium">
                Devolución #{d.id_devolucion_compra}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  d.estado_devolucion === "PENDIENTE"
                    ? "bg-yellow-100 text-yellow-800"
                    : d.estado_devolucion === "APROBADA"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {d.estado_devolucion}
              </span>
            </div>
            <p>Compra: {d.compra}</p>
            <p>Fecha: {d.fecha_devolucion}</p>
            <p>Motivo: {d.motivo_general}</p>
            <p>Monto: {d.monto_total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisDevoluciones;
