import { useState, type JSX } from "react";
import { type Categoria } from "../../services/categorias/categoriaService";

interface Props {
  categoria?: Categoria | null; // null = crear nueva
  categorias?: Categoria[];     // para el selector de padre
  onSubmit: (data: Partial<Categoria>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormularioCategoria({
  categoria = null,
  categorias = [],
  onSubmit,
  onCancel,
  loading = false,
}: Props) {
  const [nombre, setNombre] = useState(categoria?.nombre || "");
  const [idPadre, setIdPadre] = useState<number | null>(
    categoria?.id_catpadre ?? null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Categoria> = {
      nombre: nombre.trim().toUpperCase(),
      id_catpadre: idPadre || null,
    };
    onSubmit(data);
  };

  /** Renderiza opciones jerárquicas del selector padre */
  const renderOptions = (lista: Categoria[], nivel = 0): JSX.Element[] =>
    lista.flatMap((cat) => [
      <option
        key={cat.id_categoria}
        value={cat.id_categoria}
        disabled={cat.id_categoria === categoria?.id_categoria}
      >
        {"—".repeat(nivel)} {cat.nombre}
      </option>,
      ...(cat.subcategorias ? renderOptions(cat.subcategorias, nivel + 1) : []),
    ]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {categoria ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* === Campo: Nombre === */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de la categoría
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
              className="w-full border rounded px-2 py-1 focus:ring focus:ring-pink-300"
              placeholder="Ej: LENTES SIN MEDIDA"
              required
              maxLength={40}
            />
          </div>

          {/* === Campo: Categoría padre (opcional) === */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Categoría padre (opcional)
            </label>
            <select
              value={idPadre ?? ""}
              onChange={(e) =>
                setIdPadre(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full border rounded px-2 py-1 focus:ring focus:ring-pink-300"
            >
              <option value="">— Ninguna (principal) —</option>
              {renderOptions(categorias)}
            </select>
          </div>

          {/* === Botones === */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
