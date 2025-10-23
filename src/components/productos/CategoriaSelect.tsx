import type { JSX } from "react";
import { type Categoria } from "../../services/productos/ProductoService";

interface CategoriaSelectProps {
  categorias: Categoria[];
  valor: string;
  onChange: (value: string) => void;
}

export default function CategoriaSelect({ categorias, valor, onChange }: CategoriaSelectProps) {
  const renderCategorias = (categoria: any, nivel = 0): JSX.Element[] => {
    const indent = "\u00A0\u00A0\u00A0".repeat(nivel);
    const opciones = [
      <option
        key={categoria.id_categoria}
        value={categoria.id_categoria}
        className={nivel === 0 ? "font-semibold text-gray-700" : "text-gray-500"}
      >
        {`${indent}${categoria.nombre}`}
      </option>,
    ];

    if (categoria.subcategorias && categoria.subcategorias.length > 0) {
      categoria.subcategorias.forEach((sub: any) => {
        opciones.push(...renderCategorias(sub, nivel + 1));
      });
    }

    return opciones;
  };

  return (
    <>
      <label className="block text-gray-700 mb-2 font-medium">Categoría del producto</label>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-xl px-4 py-2 w-full mb-8 focus:ring-2 focus:ring-pink-300"
      >
        <option value="">Seleccione una categoría...</option>
        {categorias.flatMap((cat) => renderCategorias(cat))}
      </select>
    </>
  );
}