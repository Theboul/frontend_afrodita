import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: "Producto 1", descripcion: "Descripción 1", precio: 10 },
    { id: 2, nombre: "Producto 2", descripcion: "Descripción 2", precio: 20 },
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", descripcion: "", precio: 0 });

  const agregarProducto = () => {
    if (!nuevoProducto.nombre) return;
    setProductos([...productos, { id: productos.length + 1, ...nuevoProducto }]);
    setNuevoProducto({ nombre: "", descripcion: "", precio: 0 });
  };

  const eliminarProducto = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const editarProducto = (id: number) => {
    const prod = productos.find((p) => p.id === id);
    if (!prod) return;
    const nuevoNombre = prompt("Nuevo nombre:", prod.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", prod.descripcion);
    const nuevoPrecioStr = prompt("Nuevo precio:", prod.precio.toString());
    if (nuevoNombre !== null && nuevaDescripcion !== null && nuevoPrecioStr !== null) {
      const nuevoPrecio = parseFloat(nuevoPrecioStr);
      setProductos(
        productos.map((p) =>
          p.id === id ? { ...p, nombre: nuevoNombre, descripcion: nuevaDescripcion, precio: nuevoPrecio } : p
        )
      );
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoProducto.descripcion}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
          />
          <input
  type="number"
  placeholder="Precio"
  value={nuevoProducto.precio}
  onChange={(e) => {
    const valor = parseFloat(e.target.value);
    setNuevoProducto({ 
      ...nuevoProducto, 
      precio: isNaN(valor) || valor < 0 ? 0 : valor 
    });
  }}
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
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2 font-medium">{p.nombre}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2">${p.precio}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => editarProducto(p.id)}
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

  