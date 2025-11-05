import { useEffect, useMemo, useState } from 'react';
import { paymentService, type MetodoPago, type IniciarPagoResponse } from '../../services/ventas/paymentService';

export default function PagoQRDemo() {
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [idVenta, setIdVenta] = useState<number>(0);
  const [monto, setMonto] = useState<number>(0);
  const [moneda, setMoneda] = useState<'BOB' | 'USD'>('BOB');
  const [idMetodo, setIdMetodo] = useState<number | undefined>(undefined);
  const [descripcion, setDescripcion] = useState<string>('');

  // Payment state
  const [pago, setPago] = useState<IniciarPagoResponse | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const metodoSeleccionado = useMemo(
    () => metodos.find((m) => m.id_metodo_pago === idMetodo),
    [metodos, idMetodo]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await paymentService.getMetodosPago();
        if (res.success) setMetodos(res.data.methods || []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? 'No se pudieron cargar los métodos de pago');
      }
    })();
  }, []);

  const iniciar = async () => {
    setError(null);
    setStatusMsg('');
    setLoading(true);
    try {
      if (!idVenta || monto <= 0) {
        setError('Completa id_venta y monto');
        return;
      }
      const body = {
        id_venta: idVenta,
        monto,
        moneda,
        ...(idMetodo ? { id_metodo_pago: idMetodo } : { metodo: 'QR_FISICO' }),
        descripcion,
      } as const;
      const res = await paymentService.iniciarPago(body);
      if (!res.success) throw new Error(res.message);
      setPago(res.data);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  const confirmar = async () => {
    if (!pago?.token) return setError('No hay token para confirmar');
    setError(null);
    setLoading(true);
    try {
      const res = await paymentService.confirmarPago(pago.token);
      if (!res.success) throw new Error(res.message);
      setStatusMsg(`Pago ${res.data.status}`);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo confirmar el pago');
    } finally {
      setLoading(false);
    }
  };

  const consultar = async () => {
    if (!pago?.reference) return setError('Sin referencia para consultar');
    setError(null);
    setLoading(true);
    try {
      const res = await paymentService.estadoPago(pago.reference);
      if (!res.success) throw new Error(res.message);
      setStatusMsg(`Estado: ${res.data.status}`);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo consultar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-4">
      <h2 className="text-lg font-semibold">Demo de Pago (QR físico)</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm gap-1">
          id_venta
          <input type="number" value={idVenta || ''} onChange={(e) => setIdVenta(Number(e.target.value))} className="border rounded px-2 py-1" />
        </label>
        <label className="flex flex-col text-sm gap-1">
          monto
          <input type="number" step="0.01" value={monto || ''} onChange={(e) => setMonto(Number(e.target.value))} className="border rounded px-2 py-1" />
        </label>
        <label className="flex flex-col text-sm gap-1">
          moneda
          <select value={moneda} onChange={(e) => setMoneda(e.target.value as 'BOB' | 'USD')} className="border rounded px-2 py-1">
            <option value="BOB">BOB</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label className="flex flex-col text-sm gap-1">
          método
          <select value={idMetodo ?? ''} onChange={(e) => setIdMetodo(e.target.value ? Number(e.target.value) : undefined)} className="border rounded px-2 py-1">
            <option value="">QR_FISICO (por defecto)</option>
            {metodos.map((m) => (
              <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                {m.tipo}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm col-span-2 gap-1">
          descripción (opcional)
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border rounded px-2 py-1" />
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={iniciar} disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50">
          {loading ? 'Enviando...' : 'Iniciar pago'}
        </button>
        <button onClick={confirmar} disabled={!pago?.token || loading} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50">
          Confirmar pago
        </button>
        <button onClick={consultar} disabled={!pago?.reference || loading} className="bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50">
          Consultar estado
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {statusMsg && <div className="text-green-700 text-sm">{statusMsg}</div>}

      {pago && (
        <div className="mt-3 p-3 border rounded text-sm">
          <div>reference: <b>{pago.reference}</b></div>
          <div>status: {pago.status}</div>
          <div>method: {pago.method}</div>
          {pago.qr?.payload && (
            <div className="mt-2">
              <div className="font-medium">QR payload:</div>
              <pre className="bg-gray-100 p-2 rounded break-all whitespace-pre-wrap">{pago.qr.payload}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

