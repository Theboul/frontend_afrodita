import { useState } from "react";

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([
    { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema" },
    { id: 2, nombre: "Editor", descripcion: "Puede modificar contenido" },
    { id: 3, nombre: "Cliente", descripcion: "Acceso limitado al catálogo" },
  ]);

  const [nuevoRol, setNuevoRol] = useState({ nombre: "", descripcion: "" });

  const agregarRol = () => {
    if (!nuevoRol.nombre) return;
    setRoles([...roles, { id: roles.length + 1, ...nuevoRol }]);
    setNuevoRol({ nombre: "", descripcion: "" });
  };

  const eliminarRol = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const editarRol = (id: number) => {
    const rolAEditar = roles.find((r) => r.id === id);
    if (rolAEditar) {
      const nuevoNombre = prompt("Nuevo nombre del rol:", rolAEditar.nombre);
      const nuevaDescripcion = prompt("Nueva descripción del rol:", rolAEditar.descripcion);
      if (nuevoNombre !== null && nuevaDescripcion !== null) {
        setRoles(
          roles.map((r) =>
            r.id === id ? { ...r, nombre: nuevoNombre, descripcion: nuevaDescripcion } : r
          )
        );
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#FF84AF] py-4 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Gestión de Roles</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Rol</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del Rol"
              value={nuevoRol.nombre}
              onChange={(e) => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoRol.descripcion}
              onChange={(e) => setNuevoRol({ ...nuevoRol, descripcion: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#F4AFCC]"
            />
          </div>
          <button
            onClick={agregarRol}
            className="mt-5 px-6 py-2 bg-[#FF84AF] py-4 text-white font-medium rounded-lg hover:bg-pink-600 transition"
          >
            Guardar Rol
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[#FF84AF] py-4 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{rol.id}</td>
                  <td className="px-6 py-3 font-medium">{rol.nombre}</td>
                  <td className="px-6 py-3">{rol.descripcion}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      onClick={() => eliminarRol(rol.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => editarRol(rol.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
    
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No hay roles registrados
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
