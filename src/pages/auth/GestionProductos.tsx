import { useEffect, useState } from "react";
import { ProductoService, type Producto } from "../../services/ProductoService";

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    estado_producto: "activo",
    categoria: 1,        
    configuracion: "C001" 
  });

  // Cargar productos al montar
  useEffect(() => {
    ProductoService.listar().then(res => setProductos(res.data));
  }, []);

  const agregarProducto = () => {
    if (!nuevoProducto.nombre) return;

    ProductoService.crear(nuevoProducto)
      .then(() => ProductoService.listar().then(res => setProductos(res.data)))
      .finally(() => setNuevoProducto({ nombre: "", descripcion: "", precio: 0 }));
  };

  const eliminarProducto = (id: string) => {
    ProductoService.eliminar(id).then(() => {
      setProductos(productos.filter(p => p.id_producto !== id));
    });
  };

  const editarProducto = (id: string) => {
    const prod = productos.find((p) => p.id_producto === id);
    if (!prod) return;

    const nuevoNombre = prompt("Nuevo nombre:", prod.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", prod.descripcion);
    const nuevoPrecioStr = prompt("Nuevo precio:", prod.precio.toString());

    if (nuevoNombre && nuevaDescripcion && nuevoPrecioStr) {
      const nuevoPrecio = parseFloat(nuevoPrecioStr);

      ProductoService.actualizar(id, {
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        precio: nuevoPrecio,
      }).then(() => {
        ProductoService.listar().then(res => setProductos(res.data));
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#FF84AF] py-4 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre || ""}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoProducto.descripcion || ""}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio || 0}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: parseFloat(e.target.value) })}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
          />
          <button
            onClick={agregarProducto}
            className="mt-2 md:mt-0 bg-[#FF84AF] text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Agregar Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[#FF84AF] text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id_producto} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.id_producto}</td>
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2">${p.precio}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => eliminarProducto(p.id_producto)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => editarProducto(p.id_producto)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
