import { useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";
import { type Categoria } from "../../services/categorias/categoriaService";

import ArbolCategorias from "../../components/categorias/ArbolCategorias";
import FormularioCategoria from "../../components/categorias/FormularioCategoria";
import ModalEliminarCategoria from "../../components/categorias/ModalEliminarCategoria";
import ModalMoverCategoria from "../../components/categorias/ModalMoverCategoria";
import EstadisticasCategorias from "../../components/categorias/EstadisticasCategorias";

export default function ListaCategorias() {
  const { categorias, loading, crear, actualizar, eliminar, mover} = useCategorias();

  const [vistaArbol, setVistaArbol] = useState(true);
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null);
  const [categoriaDel, setCategoriaDel] = useState<Categoria | null>(null);
  const [categoriaMove, setCategoriaMove] = useState<Categoria | null>(null);


  const nuevaCategoria: Categoria = {
    id_categoria: 0,
    nombre: "",
    id_catpadre: null,
    estado_categoria: "ACTIVA",
    cantidad_productos: 0,
    subcategorias: [],
  };


  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
      {/* === Encabezado === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Gestión de Categorías
        </h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setVistaArbol(!vistaArbol)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm sm:text-base rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            {vistaArbol ? "Vista Tabla" : "Vista Árbol"}
          </button>
          <button
            onClick={() => setCategoriaEdit(nuevaCategoria)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm sm:text-base rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Nueva Categoría
          </button>
        </div>
      </div>

      {/* === Estadísticas === */}
      <EstadisticasCategorias />

      {/* === Contenido principal === */}
      {loading ? (
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">Cargando categorías...</p>
          </div>
        </div>
      ) : vistaArbol ? (
        <ArbolCategorias
          categorias={categorias}
          onEditar={setCategoriaEdit}
          onEliminar={setCategoriaDel}
          onMover={setCategoriaMove}
        />
      ) : (
        /* Vista tabla (oculta en móvil pequeño, visible desde sm) */
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 bg-white rounded shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2 sm:p-3 border-b text-xs sm:text-sm">Nombre</th>
                <th className="p-2 sm:p-3 border-b text-center text-xs sm:text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id_categoria} className="hover:bg-gray-50">
                  <td className="border-b p-2 sm:p-3 text-sm">{cat.nombre}</td>
                  <td className="border-b p-2 sm:p-3 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                      <button
                        className="text-yellow-600 hover:text-yellow-800 text-xs sm:text-sm px-2 py-1"
                        onClick={() => setCategoriaEdit(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm px-2 py-1"
                        onClick={() => setCategoriaDel(cat)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === Modal Crear / Editar === */}
      {categoriaEdit && (
        <FormularioCategoria
          categoria={categoriaEdit}
          categorias={categorias}
          onSubmit={async (data) => {
            if (categoriaEdit.id_categoria)
              await actualizar(categoriaEdit.id_categoria, data);
            else await crear(data);
            setCategoriaEdit(null);
          }}
          onCancel={() => setCategoriaEdit(null)}
        />
      )}

      {/* === Modal Eliminar === */}
      <ModalEliminarCategoria
        show={!!categoriaDel}
        categoria={categoriaDel ?? nuevaCategoria} // evita undefined
        onConfirm={async () => {
          if (categoriaDel) {
            await eliminar(categoriaDel.id_categoria);
            setCategoriaDel(null);
          }
        }}
        onCancel={() => setCategoriaDel(null)}
      />

      {/* === Modal Mover === */}
      <ModalMoverCategoria
        show={!!categoriaMove}
        categoria={categoriaMove ?? nuevaCategoria}
        categorias={categorias}
        onConfirm={async () => {
          if (categoriaMove) {
            await mover(categoriaMove.id_categoria, null, "Reorganización manual");
            setCategoriaMove(null);
          }
        }}
        onCancel={() => setCategoriaMove(null)}
      />
    </div>
  );
}
