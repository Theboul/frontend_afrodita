import { useState } from "react";
import { type Producto, type Categoria, type Configuracion } from "../../services/productos/ProductoService";
import CategoriaSelect from "./CategoriaSelect";
import ConfiguracionSelect from "./ConfiguracionSelect";
import VisibilidadToggle from "./VisibilidadToggle";
import ImagenUpload from "./ImagenUpload";

interface ProductoFormProps {
  producto: Partial<Producto>;
  categorias: Categoria[];
  configuraciones: Configuracion[];
  onGuardar: (productoData: Partial<Producto>) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
  onCambioProducto: (producto: Partial<Producto>) => void;
  onImagenesSubidas?: () => void;
}

export default function ProductoForm({
  producto,
  categorias,
  configuraciones,
  onGuardar,
  onEliminar,
  onCambioProducto,
  onImagenesSubidas
}: ProductoFormProps) {
  const [visibilidad, setVisibilidad] = useState<"mostrar" | "ocultar" | null>("mostrar");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onCambioProducto({ ...producto, [name]: value });
  };

  const handleVisibilidadChange = (nuevaVisibilidad: "mostrar" | "ocultar" | null) => {
    setVisibilidad(nuevaVisibilidad);
    onCambioProducto({ 
      ...producto, 
      estado_producto: nuevaVisibilidad === "mostrar" ? "ACTIVO" : "INACTIVO" 
    });
  };

  const handleGuardar = () => {
    if (!producto.nombre || !producto.id_categoria) {
      alert("Debe llenar los campos obligatorios.");
      return;
    }
    onGuardar(producto);
  };

  const handleEliminar = () => {
    if (producto.id_producto) {
      onEliminar(producto.id_producto);
    }
  };

  return (
    <>
      {/* FORMULARIO - Mismo diseño que el original */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        <input
          name="id_producto"
          type="text"
          placeholder="ID del Producto"
          value={producto.id_producto || ""}
          onChange={handleChange}
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
        />
        <input
          name="nombre"
          type="text"
          placeholder="Nombre del Producto"
          value={producto.nombre || ""}
          onChange={handleChange}
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
        />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={producto.precio || ""}
          onChange={handleChange}
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={producto.stock || ""}
          onChange={handleChange}
          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción del producto"
          value={producto.descripcion || ""}
          onChange={handleChange}
          className="border rounded-xl px-4 py-2 w-full h-24 focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* VISIBILIDAD - Mismo diseño */}
      <VisibilidadToggle 
        valor={visibilidad}
        onChange={handleVisibilidadChange}
      />

      {/* CONFIGURACIÓN - Mismo diseño */}
      <ConfiguracionSelect
        configuraciones={configuraciones}
        valor={producto.id_configuracion || ""}
        onChange={(value) => onCambioProducto({ ...producto, id_configuracion: value })}
      />

      {/* FOTOS - ✅ AGREGAR AQUÍ EL COMPONENTE ImagenUpload */}
      {producto.id_producto && onImagenesSubidas && (
        <ImagenUpload 
          productoId={producto.id_producto}
          onImagenesSubidas={onImagenesSubidas}
        />
      )}

      {/* CATEGORÍA - Mismo diseño */}
      <CategoriaSelect
        categorias={categorias}
        valor={producto.id_categoria || ""}
        onChange={(value) => onCambioProducto({ ...producto, id_categoria: value })}
      />

      {/* BOTONES - Mismo diseño */}
      <div className="flex justify-end gap-4">
        <button className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400">
          Volver
        </button>
        <button
          onClick={handleGuardar}
          className="bg-pink-400 text-white px-5 py-2 rounded-lg hover:bg-pink-500 transition"
        >
          Guardar
        </button>
        <button
          onClick={handleEliminar}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Eliminar
        </button>
      </div>
    </>
  );
}