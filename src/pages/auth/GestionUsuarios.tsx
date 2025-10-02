import { useState } from "react";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "Juan Pérez", correo: "juan@correo.com", rol: "Admin" },
    { id: 2, nombre: "Ana López", correo: "ana@correo.com", rol: "Cliente" },
  ]);

  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario | null>(null);

  const handleAdd = () => {
    setNuevoUsuario({ id: Date.now(), nombre: "", correo: "", rol: "" });
  };

  const handleSave = () => {
    if (nuevoUsuario) {
      setUsuarios([...usuarios, nuevoUsuario]);
      setNuevoUsuario(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Nuevo Usuario
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.nombre}</td>
              <td className="border p-2">{u.correo}</td>
              <td className="border p-2">{u.rol}</td>
              <td className="border p-2">
                <button className="text-blue-600 mr-2">Editar</button>
                <button className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nuevoUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nuevo Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="email"
              placeholder="Correo"
              value={nuevoUsuario.correo}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Rol"
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNuevoUsuario(null)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
