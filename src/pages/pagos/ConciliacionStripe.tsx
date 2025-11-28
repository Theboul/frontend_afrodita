import { useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { useConciliacionStripe } from "../../hooks/useConciliacionStripe";

export default function ConciliacionStripePage() {
  const [idVenta, setIdVenta] = useState<string>("");
  const [referencia, setReferencia] = useState<string>("");

  const {
    conciliar,
    cargarResumen,
    reset,
    loading,
    code,
    message,
    detalle,
    resumen,
    codeMessages,
  } = useConciliacionStripe();

  const handleConciliar = async () => {
    const id = Number(idVenta);
    if (!id || !referencia) return;
    try {
      await conciliar({ referencia, idVenta: id });
    } catch (e) {
      /* el hook ya maneja el mensaje */
    }
  };

  const handleResumen = async () => {
    const id = Number(idVenta);
    if (!id) return;
    try {
      await cargarResumen(id);
    } catch (e) {
      /* sin-op: se mantiene el estado */
    }
  };

  const renderResumen = () => {
    if (!resumen) return null;
    const transacciones = resumen.transacciones ?? resumen.transactions ?? [];
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-purple-700 font-semibold">Resumen de venta</p>
            <p className="text-lg font-bold text-gray-900">Venta #{resumen.id ?? idVenta}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
            Estado: {resumen.estado ?? resumen.status ?? "Sin estado"}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-700">
          {resumen.total !== undefined && (
            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-xs uppercase text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">
                {resumen.total} {resumen.currency ?? ""}
              </p>
            </div>
          )}
          {detalle?.referencia && (
            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-xs uppercase text-gray-500">Referencia</p>
              <p className="text-sm font-mono text-gray-900">{detalle.referencia}</p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-800">Transacciones</p>
          {transacciones.length === 0 ? (
            <div className="text-sm text-gray-600">No hay transacciones.</div>
          ) : (
            <div className="border border-gray-200 rounded-md divide-y">
              {transacciones.map((tx: any, idx: number) => (
                <div
                  key={tx.id ?? idx}
                  className="p-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {tx.referencia ?? tx.reference ?? "Sin referencia"}
                    </p>
                    <p className="text-xs text-gray-500">{tx.fecha ?? tx.created_at ?? ""}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800">
                      {tx.estado ?? tx.status ?? "Sin estado"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(tx.monto ?? tx.amount ?? "")} {(tx.moneda ?? tx.currency ?? "")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const statusBadge = code ? (
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        code === "OK"
          ? "bg-green-100 text-green-800"
          : code === "E4"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {code}: {codeMessages[code]}
    </span>
  ) : null;

  return (
    <ModuleLayout title="Conciliación de Transacciones">
      <div className="grid gap-4">
        <div className="bg-white p-5 rounded-lg shadow space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-purple-700 font-semibold">Conciliar pago</p>
              <h2 className="text-xl font-bold text-gray-900">Ingresa venta y referencia</h2>
            </div>
            {statusBadge}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-700 font-medium">id_venta</span>
              <input
                type="number"
                value={idVenta}
                onChange={(e) => setIdVenta(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ej: 120"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm md:col-span-2">
              <span className="text-gray-700 font-medium">Referencia (paymentIntent id)</span>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="pi_xxx"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              label={loading ? "Conciliando..." : "Conciliar"}
              color="info"
              onClick={handleConciliar}
              disabled={loading || !idVenta || !referencia}
            />
            <Button
              label="Limpiar"
              color="warning"
              onClick={() => {
                setIdVenta("");
                setReferencia("");
                reset();
              }}
            />
            {code === "OK" && (
              <Button
                label={loading ? "Actualizando..." : "Refrescar resumen"}
                color="success"
                onClick={handleResumen}
                disabled={loading || !idVenta}
              />
            )}
          </div>
          {message && (
            <div className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
              {message}
              {detalle?.monto && (
                <span className="ml-2 font-semibold">
                  Monto: {detalle.monto} {detalle.moneda ?? ""}
                </span>
              )}
              {detalle?.stripe_status && (
                <span className="ml-2 text-gray-700">Stripe: {detalle.stripe_status}</span>
              )}
            </div>
          )}
        </div>

        {loading && <Loading message="Procesando conciliación..." />}

        {resumen && <div className="bg-white p-5 rounded-lg shadow">{renderResumen()}</div>}
      </div>
    </ModuleLayout>
  );
}
