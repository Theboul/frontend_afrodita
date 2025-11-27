// src/components/devoluciones/TablaDevoluciones.tsx
import type { DevolucionCompra } from "../../services/devoluciones/devolucionesService";

interface Props {
  devoluciones: any[];
  onAprobar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export const TablaDevoluciones: React.FC<Props> = ({
  devoluciones,
  onAprobar,
  onRechazar,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border p-4 bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-pink-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Compra</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Motivo</th>
            <th className="px-4 py-2">Monto</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {devoluciones.map((item) => (
            <tr key={item.id_devolucion_compra} className="text-center">
              <td className="border px-4 py-2">{item.id_devolucion_compra}</td>
              <td className="border px-4 py-2">{item.compra}</td>
              <td className="border px-4 py-2">{item.fecha_devolucion}</td>
              <td className="border px-4 py-2">{item.motivo_general}</td>
              <td className="border px-4 py-2">{item.monto_total}</td>
              <td className="border px-4 py-2">{item.estado_devolucion}</td>

              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => onAprobar(item.id_devolucion_compra)}
                >
                  Aprobar
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => onRechazar(item.id_devolucion_compra)}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {devoluciones.length === 0 && (
        <p className="text-gray-500 mt-4">No hay solicitudes registradas.</p>
      )}
    </div>
  );
};