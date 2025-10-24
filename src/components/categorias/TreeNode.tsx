import { type Categoria } from "../../services/categorias/categoriaService";
import { useState } from "react";

interface Props {
  categoria: Categoria;
  nivel?: number;
  searchTerm?: string;
  onEditar: (categoria: Categoria) => void;
  onEliminar: (categoria: Categoria) => void;
  onMover: (categoria: Categoria, nuevoPadre: number | null) => void;
  onSelect?: (categoria: Categoria) => void;
}

export default function TreeNode({
  categoria,
  nivel = 0,
  searchTerm = "",
  onEditar,
  onEliminar,
  onMover,
  onSelect,
}: Props) {
  const [isOver, setIsOver] = useState(false);
  const tieneHijos = categoria.subcategorias && categoria.subcategorias.length > 0;

  const resaltar = (texto: string) => {
    if (!searchTerm.trim()) return texto;
    const partes = texto.split(new RegExp(`(${searchTerm})`, "gi"));
    return partes.map((parte, i) =>
      parte.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-yellow-800 rounded px-0.5">
          {parte}
        </mark>
      ) : (
        <span key={i}>{parte}</span>
      )
    );
  };

  // Drag & drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("id", categoria.id_categoria.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const idOrigen = parseInt(e.dataTransfer.getData("id"));
    if (idOrigen !== categoria.id_categoria) {
      onMover({ id_categoria: idOrigen } as Categoria, categoria.id_categoria);
    }
    setIsOver(false);
  };

  return (
    <div
      style={{ marginLeft: nivel * 12 }}
      className={`my-1 rounded ${isOver ? "bg-pink-100 border border-pink-300" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={() => onSelect?.(categoria)}
        className="flex items-center justify-between bg-gray-50 p-2 sm:p-2.5 rounded-md hover:bg-gray-100 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="text-base sm:text-lg flex-shrink-0">
            {tieneHijos ? "📁" : "📄"}
          </span>
          <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
            {resaltar(categoria.nombre)}
          </span>
          {categoria.cantidad_productos > 0 && (
            <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full flex-shrink-0">
              {categoria.cantidad_productos}
            </span>
          )}
        </div>

        <div className="flex gap-1 sm:gap-2 text-sm sm:text-base flex-shrink-0 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(categoria);
            }}
            className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(categoria);
            }}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      {tieneHijos && (
        <div className="mt-1 border-l-2 border-gray-200 pl-2 sm:pl-3">
          {categoria.subcategorias!.map((sub) => (
            <TreeNode
              key={sub.id_categoria}
              categoria={sub}
              nivel={nivel + 1}
              searchTerm={searchTerm}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onMover={onMover}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
