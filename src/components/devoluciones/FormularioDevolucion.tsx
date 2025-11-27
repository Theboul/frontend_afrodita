// src/components/devoluciones/FormularioDevolucion.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useDevolucionesStore } from "../../stores/devolucionesStore";

interface Props {
  compraId?: number; // opcional si ya vienes desde el detalle de compra
  onSuccess?: () => void;
}

export const FormularioDevolucion: React.FC<Props> = ({
  compraId,
  onSuccess,
}) => {
  const crear = useDevolucionesStore((s) => s.crear);
  const [compra, setCompra] = useState<number | "">(
    compraId ?? ""
  );
  const [motivo, setMotivo] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!compra || !motivo || !monto) {
      alert("Completa todos los campos");
      return;
    }
    setSending(true);
    try {
      await crear({
        compra: Number(compra),
        motivo_general: motivo,
        monto_total: Number(monto),
        fecha_devolucion: fecha,
      } as any); // tip sencillo para no pelear con TS

      alert("Solicitud de devolución registrada correctamente");
      setMotivo("");
      setMonto("");
      if (!compraId) setCompra("");
      onSuccess?.();
    } catch {
      // el store ya maneja error; puedes mostrar un toast aquí
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      className="space-y-4 p-4 border rounded-md bg-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold">
        Generar Devolución / Reembolso
      </h2>

      {!compraId && (
        <div>
          <label className="block text-sm font-medium">
            ID de Compra
          </label>
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={compra}
            onChange={(e) => setCompra(e.target.value ? Number(e.target.value) : "")}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">
          Fecha de devolución
        </label>
        <input
          type="date"
          className="mt-1 w-full border rounded px-2 py-1"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Motivo general
        </label>
        <textarea
          className="mt-1 w-full border rounded px-2 py-1"
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Monto total a devolver
        </label>
        <input
          type="number"
          className="mt-1 w-full border rounded px-2 py-1"
          value={monto}
          onChange={(e) =>
            setMonto(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="px-4 py-2 rounded bg-purple-600 text-white text-sm disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
};
