import { useEffect, useState } from "react";
import { ProductoService, type Producto } from "../../services/productos/ProductoService";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [visibilidad, setVisibilidad] = useState<"mostrar" | "ocultar" | null>("mostrar");
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    estado_producto: "activo",
    categoria: 1,
    configuracion: "C001",
  });

  // Cargar productos al montar
  useEffect(() => {
    ProductoService.listar().then((res) => setProductos(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = () => {
    if (!nuevoProducto.nombre) return;

    ProductoService.crear(nuevoProducto)
      .then(() => ProductoService.listar().then((res) => setProductos(res.data)))
      .finally(() =>
        setNuevoProducto({
          nombre: "",
          descripcion: "",
          precio: 0,
          stock: 0,
          estado_producto: "activo",
          categoria: 1,
          configuracion: "C001",
        })
      );
  };

  const eliminarProducto = (id: string) => {
    ProductoService.eliminar(id).then(() => {
      setProductos((prev) => prev.filter((p) => p.id_producto !== id));
    });
  };

  return (
    <div className="w-full min-h-[150vh] bg-gray-100 p-6">
      <div className="w-full h-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-pink-600">Crear Producto</h1>

        {/* Producto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="id_producto"
            type="text"
            placeholder="ID del Producto"
            value={nuevoProducto.id_producto || ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
          />
          <input
            name="nombre"
            type="text"
            placeholder="Nombre del Producto"
            value={nuevoProducto.nombre || ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
          />
          <input
            name="precio"
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio || ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={nuevoProducto.stock || ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300"
          />
          <textarea
            name="descripcion"
            placeholder="Agrega todas las especificaciones de tu producto"
            value={nuevoProducto.descripcion || ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full h-24 focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Visibilidad */}
        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibilidad === "mostrar"}
              onChange={() =>
                setVisibilidad(visibilidad === "mostrar" ? null : "mostrar")
              }
              className="accent-pink-400"
            />
            <MdVisibility
              className={`text-lg ${
                visibilidad === "mostrar" ? "text-pink-500" : "text-gray-400"
              }`}
            />
            <span
              className={`${
                visibilidad === "mostrar"
                  ? "text-pink-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Mostrar
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibilidad === "ocultar"}
              onChange={() =>
                setVisibilidad(visibilidad === "ocultar" ? null : "ocultar")
              }
              className="accent-pink-400"
            />
            <MdVisibilityOff
              className={`text-lg ${
                visibilidad === "ocultar" ? "text-pink-500" : "text-gray-400"
              }`}
            />
            <span
              className={`${
                visibilidad === "ocultar"
                  ? "text-pink-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Ocultar
            </span>
          </label>
        </div>

        {/* Fotos */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Fotos</label>
          <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-center text-gray-400">
            Área de subida de fotos
          </div>
          <button className="mt-3 bg-pink-300 text-white px-4 py-2 rounded-lg hover:bg-pink-400">
            Subir
          </button>
        </div>

        {/* Configuración */}
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Configuración (solo lentes)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input type="text" placeholder="Color" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
          <input type="text" placeholder="Curva" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
          <input type="number" placeholder="Diámetro" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
          <input type="number" placeholder="Duración" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
          <input type="text" placeholder="Material" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
          <input type="number" placeholder="Medida" className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-300" />
        </div>

        {/* Categoría */}
        <label className="block text-gray-700 mb-2 font-medium">
          Categoría del producto
        </label>
        <input
          name="categoria"
          type="text"
          placeholder="Categoría"
          value={nuevoProducto.categoria || ""}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 w-full mb-6 focus:ring-2 focus:ring-pink-300"
        />

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
            Volver
          </button>
          <button
            onClick={agregarProducto}
            className="bg-pink-300 text-white px-4 py-2 rounded-lg hover:bg-pink-400"
          >
            Guardar
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}