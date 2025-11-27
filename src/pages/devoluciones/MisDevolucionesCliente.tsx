import { useEffect } from "react";
import { useDevolucionesStore } from "../../stores/devolucionesStore";

const MisDevolucionesCliente = () => {
  const { misItems, fetchMisDevoluciones, loading, error } =
    useDevolucionesStore();

  useEffect(() => {
    fetchMisDevoluciones();
  }, [fetchMisDevoluciones]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Mis solicitudes de devolución</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full mt-3 border">
        <thead className="bg-pink-300">
          <tr>
            <th>ID</th>
            <th>Compra</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {misItems.map((dev) => (
            <tr key={dev.id_devolucion_compra}>
              <td>{dev.id_devolucion_compra}</td>
              <td>{dev.compra}</td>
              <td>{dev.fecha_devolucion}</td>
              <td>{dev.motivo_general}</td>
              <td>{dev.monto_total}</td>
              <td>{dev.estado_devolucion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MisDevolucionesCliente;
