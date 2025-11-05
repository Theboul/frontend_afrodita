import { useState } from "react";
import type { MetodoPago } from "../../services/pagos/paymentMethodService";

interface Props {
  metodo?: MetodoPago | null;
  onSubmit: (data: Partial<MetodoPago>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MetodoPagoForm({ metodo = null, onSubmit, onCancel, loading = false }: Props) {
  const [tipo, setTipo] = useState(metodo?.tipo ?? "");
  const [categoria, setCategoria] = useState(metodo?.categoria ?? "");
  const [descripcion, setDescripcion] = useState(metodo?.descripcion ?? "");
  const [requierePasarela, setRequierePasarela] = useState<boolean>(metodo?.requiere_pasarela ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tipo: tipo.trim(),
      categoria: categoria.trim().toUpperCase(),
      descripcion: descripcion.trim() || undefined,
      requiere_pasarela: requierePasarela,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          {metodo ? "Editar Método de Pago" : "Nuevo Método de Pago"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">Tipo</label>
            <input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-pink-300"
              placeholder="Ej: TARJETA, TRANSFERENCIA, EFECTIVO"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">Categoría</label>
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value.toUpperCase())}
              className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-pink-300"
              placeholder="Ej: ONLINE, PRESENCIAL"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">Descripción (opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-pink-300"
              placeholder="Detalle del método de pago"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="requiere_pasarela"
              type="checkbox"
              checked={requierePasarela}
              onChange={(e) => setRequierePasarela(e.target.checked)}
              className="h-4 w-4 text-pink-600 border-pink-300 rounded focus:ring-pink-400"
            />
            <label htmlFor="requiere_pasarela" className="text-sm">Requiere pasarela</label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}