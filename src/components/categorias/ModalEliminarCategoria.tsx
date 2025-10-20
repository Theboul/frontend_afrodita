import { useState, type JSX } from "react";
import { type Categoria } from "../../services/categorias/categoriaService";
import { CategoriaService } from "../../services/categorias/categoriaService";

interface Props {
  show: boolean;
  categoria: Categoria;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalEliminarCategoria({
  show,
  categoria,
  onConfirm,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const tieneSubcategorias = categoria.subcategorias.length > 0;
  const tieneProductos = categoria.cantidad_productos > 0;

  // === Validación previa antes de intentar eliminar ===
  const puedeEliminar = !tieneSubcategorias && !tieneProductos;

  const handleEliminar = async () => {
    if (confirmText.trim() !== categoria.nombre.trim()) {
      setError("El nombre no coincide. Escribe correctamente para confirmar.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await CategoriaService.eliminar(categoria.id_categoria);
      onConfirm();
    } catch (err) {
      setError("No se pudo eliminar la categoría. Verifica las dependencias.");
    } finally {
      setLoading(false);
    }
  };

  // === Mensajes de advertencia según el caso ===
  let advertencia: JSX.Element;

  if (tieneSubcategorias && tieneProductos) {
    advertencia = (
      <div className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 p-3 rounded mb-4 text-sm">
        ⚠️ Esta categoría tiene <b>subcategorías</b> y <b>productos</b> asignados.<br />
        No puede eliminarse hasta que ambas dependencias sean resueltas.
      </div>
    );
  } else if (tieneSubcategorias) {
    advertencia = (
      <div className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 p-3 rounded mb-4 text-sm">
        ⚠️ Esta categoría tiene <b>{categoria.subcategorias.length}</b>{" "}
        subcategoría(s). Elimínalas o muévelas antes de continuar.
      </div>
    );
  } else if (tieneProductos) {
    advertencia = (
      <div className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 p-3 rounded mb-4 text-sm">
        ⚠️ Esta categoría contiene{" "}
        <b>{categoria.cantidad_productos}</b> producto(s).<br />
        Reasigna o elimina los productos antes de continuar.
      </div>
    );
  } else {
    advertencia = (
      <div className="bg-red-50 text-red-700 border-l-4 border-red-400 p-3 rounded mb-4 text-sm">
        Esta acción eliminará la categoría de forma <b>permanente</b>.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[480px] animate-fadeIn">
        {/* === Header === */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Eliminar Categoría
        </h2>

        {/* === Info de categoría === */}
        <p className="text-gray-600 text-sm mb-2">Vas a eliminar la categoría:</p>
        <p className="font-medium text-pink-700 mb-4">{categoria.nombre}</p>

        {/* === Advertencia según dependencias === */}
        {advertencia}

        {/* === Confirmación === */}
        {puedeEliminar && (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Escribe el nombre para confirmar:
            </label>
            <input
              type="text"
              placeholder={categoria.nombre}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1 focus:ring focus:ring-pink-300"
            />
          </>
        )}

        {/* === Mensaje de error === */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* === Botones === */}
        <div className="flex justify-end space-x-2 mt-5">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            disabled={
              loading ||
              !puedeEliminar ||
              confirmText.trim() !== categoria.nombre.trim()
            }
            onClick={handleEliminar}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
