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
    <div className="p-6 space-y-4">
      {/* === Encabezado === */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestión de Categorías
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => setVistaArbol(!vistaArbol)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            {vistaArbol ? "Vista Tabla" : "Vista Árbol"}
          </button>
          <button
            onClick={() => setCategoriaEdit(nuevaCategoria)}
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Nueva Categoría
          </button>
        </div>
      </div>

      {/* === Estadísticas === */}
      <EstadisticasCategorias />

      {/* === Contenido principal === */}
      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
      ) : vistaArbol ? (
        <ArbolCategorias
          categorias={categorias}
          onEditar={setCategoriaEdit}
          onEliminar={setCategoriaDel}
          onMover={setCategoriaMove}
        />
      ) : (
        <table className="w-full border border-gray-200 bg-white rounded shadow-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2 border-b">Nombre</th>
              <th className="p-2 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td className="border-b p-2">{cat.nombre}</td>
                <td className="border-b p-2 text-center space-x-2">
                  <button
                    className="text-yellow-600 hover:text-yellow-800"
                    onClick={() => setCategoriaEdit(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => setCategoriaDel(cat)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* === Modal Crear / Editar === */}
      {categoriaEdit && (
        <FormularioCategoria
          categoria={categoriaEdit}
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
