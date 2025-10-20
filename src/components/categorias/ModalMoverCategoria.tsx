import { useState, type JSX } from "react";
import { type Categoria } from "../../services/categorias/categoriaService";
import { CategoriaService } from "../../services/categorias/categoriaService";

interface Props {
  show: boolean;
  categoria: Categoria;
  categorias: Categoria[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalMoverCategoria({
  show,
  categoria,
  categorias,
  onConfirm,
  onCancel,
}: Props) {
  const [nuevoPadre, setNuevoPadre] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  // === Evitar mover dentro de sí misma o sus subcategorías ===
  const esDescendiente = (cat: Categoria, objetivoId: number): boolean => {
    if (!cat.subcategorias) return false;
    return cat.subcategorias.some(
      (sub) => sub.id_categoria === objetivoId || esDescendiente(sub, objetivoId)
    );
  };

  const renderOptions = (lista: Categoria[], nivel = 0): JSX.Element[] => {
    return lista.flatMap((cat) => [
      <option
        key={cat.id_categoria}
        value={cat.id_categoria}
        disabled={
          cat.id_categoria === categoria.id_categoria ||
          esDescendiente(categoria, cat.id_categoria)
        }
      >
        {"—".repeat(nivel)} {cat.nombre}
      </option>,
      ...(cat.subcategorias ? renderOptions(cat.subcategorias, nivel + 1) : []),
    ]);
  };

  const handleMover = async () => {
    try {
      setLoading(true);
      setError(null);
      await CategoriaService.mover(categoria.id_categoria, nuevoPadre, motivo);
      onConfirm();
    } catch (err) {
      setError("No se pudo mover la categoría. Verifica dependencias.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[480px] animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Mover Categoría</h2>

        <p className="text-gray-600 text-sm mb-3">
          <strong>Categoría actual:</strong>{" "}
          <span className="text-pink-700">{categoria.nombre}</span>
        </p>

        <label className="block text-sm font-medium mt-2">
          Nueva ubicación:
        </label>
        <select
          value={nuevoPadre ?? ""}
          onChange={(e) =>
            setNuevoPadre(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border rounded px-2 py-1 mt-1 focus:ring focus:ring-pink-300"
        >
          <option value="">— Convertir en categoría principal —</option>
          {renderOptions(categorias)}
        </select>

        <label className="block text-sm font-medium mt-4">
          Motivo del movimiento (opcional)
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej: Reorganización del catálogo"
          className="w-full border rounded px-2 py-1 mt-1 focus:ring focus:ring-pink-300"
          maxLength={200}
          rows={3}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-2 mt-5">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleMover}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Moviendo..." : "Mover Categoría"}
          </button>
        </div>
      </div>
    </div>
  );
}
