import { useState, useMemo, useCallback } from "react";
import { type Categoria } from "../../services/categorias/categoriaService";
import TreeNode from "./TreeNode";
import BreadcrumbCategoria from "./BreadcrumbCategoria";

interface Props {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onEliminar: (categoria: Categoria) => void;
  onMover: (categoria: Categoria, nuevoPadre: number | null) => void;
}

export default function ArbolCategorias({
  categorias,
  onEditar,
  onEliminar,
  onMover,
}: Props) {
  const [search, setSearch] = useState("");
  const [ruta, setRuta] = useState<Categoria[]>([]); // Breadcrumb actual

  // === Filtro recursivo ===
  const filtrar = (lista: Categoria[], term: string): Categoria[] => {
    return lista
      .map((cat) => {
        const hijos = cat.subcategorias ? filtrar(cat.subcategorias, term) : [];
        const coincide = cat.nombre.toLowerCase().includes(term);
        return coincide || hijos.length > 0
          ? { ...cat, subcategorias: hijos }
          : null;
      })
      .filter(Boolean) as Categoria[];
  };

  const categoriasFiltradas = useMemo(() => {
    if (!search.trim()) return categorias;
    return filtrar(categorias, search.toLowerCase());
  }, [search, categorias]);

  // === Función para buscar ruta completa ===
  const encontrarRuta = useCallback(
    (lista: Categoria[], id: number, camino: Categoria[] = []): Categoria[] => {
      for (const cat of lista) {
        const nuevaRuta = [...camino, cat];
        if (cat.id_categoria === id) return nuevaRuta;
        if (cat.subcategorias?.length) {
          const encontrada = encontrarRuta(cat.subcategorias, id, nuevaRuta);
          if (encontrada.length) return encontrada;
        }
      }
      return [];
    },
    []
  );

  // === Handler cuando haces clic en una categoría ===
  const handleSeleccionar = (categoria: Categoria) => {
    const nuevaRuta = encontrarRuta(categorias, categoria.id_categoria);
    setRuta(nuevaRuta);
  };

  // === Handler al navegar por breadcrumb ===
  const handleNavigate = (cat: Categoria) => {
    const nuevaRuta = encontrarRuta(categorias, cat.id_categoria);
    setRuta(nuevaRuta);
  };

  if (!categorias.length)
    return (
      <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow p-4">
        <div className="text-gray-300 text-4xl sm:text-6xl mb-4">📂</div>
        <p className="text-gray-500 text-sm sm:text-base font-medium">
          No hay categorías registradas
        </p>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Crea tu primera categoría para organizar productos
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      {/* === Header con búsqueda === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Árbol de Categorías</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 sm:px-3 py-1.5 sm:py-2 w-full sm:w-64 text-sm focus:ring focus:ring-pink-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex-shrink-0 px-2"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* === Breadcrumb actual === */}
      {ruta.length > 0 && (
        <BreadcrumbCategoria ruta={ruta} onNavigate={handleNavigate} />
      )}

      {/* === Render del árbol === */}
      <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
        {categoriasFiltradas.map((cat) => (
          <TreeNode
            key={cat.id_categoria}
            categoria={cat}
            nivel={0}
            searchTerm={search}
            onEditar={onEditar}
            onEliminar={onEliminar}
            onMover={onMover}
            onSelect={handleSeleccionar}
          />
        ))}
      </div>
    </div>
  );
}