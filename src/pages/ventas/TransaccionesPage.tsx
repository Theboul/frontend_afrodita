import ModuleLayout from "../../layouts/ModuleLayout";
import Loading from "../../components/ui/Loading";
import Button from "../../components/ui/Button";
import { useTransaccionesVentas } from "../../hooks/useTransaccionesVentas";

const columns = [
  { key: "id_transaccion", label: "ID Transacción" },
  { key: "id_venta", label: "ID Venta" },
  { key: "id_metodo_pago", label: "Método Pago" },
  { key: "monto", label: "Monto" },
  { key: "fecha_transaccion", label: "Fecha" },
  { key: "estado_transaccion", label: "Estado" },
  { key: "referencia_externa", label: "Referencia externa" },
  { key: "descripcion", label: "Descripción" },
  { key: "codigo_error", label: "Código error" },
  { key: "procesado_por", label: "Procesado por" },
  { key: "observacion", label: "Observación" },
];

export default function TransaccionesPage() {
  const { transacciones, pagination, loading, error, nextPage, prevPage, changePageSize } =
    useTransaccionesVentas();

  return (
    <ModuleLayout title="Transacciones">
      <div className="bg-white p-5 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-purple-700 font-semibold">Ventas / Pagos</p>
            <h2 className="text-xl font-bold text-gray-900">Transacciones de pago</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-700">Items por página:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-gray-600">Total: {pagination.count}</span>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-pink-200">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2 text-left text-sm text-gray-800">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-6">
                    <Loading message="Cargando transacciones..." />
                  </td>
                </tr>
              ) : transacciones.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-6 text-center text-gray-500">
                    No hay transacciones
                  </td>
                </tr>
              ) : (
                transacciones.map((tx) => (
                  <tr key={tx.id_transaccion} className="border-t">
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-2 text-sm text-gray-800">
                        {(tx as any)[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Página: {pagination.page}</span>
          </div>
          <div className="flex gap-2">
            <Button
              label="Anterior"
              color="primary"
              onClick={prevPage}
              disabled={loading || !pagination.previous}
            />
            <Button
              label="Siguiente"
              color="primary"
              onClick={nextPage}
              disabled={loading || !pagination.next}
            />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
