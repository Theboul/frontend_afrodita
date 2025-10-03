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
    <div className="bg-[#FDF2F6] min-h-screen">
      {/* Primer encapsulador - Cabecera */}
      <div className="flex items-center justify-center pt-6">
        <div className="bg-[#F4AFCC] rounded-lg shadow-lg w-full max-w-4xl">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-black text-center">Gestión de Usuarios</h1>
          </div>
        </div>
      </div>

      {/* Segundo encapsulador - Contenido principal */}
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="bg-[#FFC7C5] rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <button
              onClick={handleAdd}
              className="bg-[#16a34a] text-white px-4 py-2 rounded mb-4 hover:bg-[#15803d] transition"
            >
              + Nuevo Usuario
            </button>

            <div className="rounded-lg overflow-hidden">
              <table className="w-full border">
                <thead className="bg-[#f3f4f6]">
                  <tr>
                    <th className="border p-2 bg-[#FEF7FF]">Nombre</th>
                    <th className="border p-2 bg-[#FEF7FF]">Correo</th>
                    <th className="border p-2 bg-[#FEF7FF]">Rol</th>
                    <th className="border p-2 bg-[#FEF7FF]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="border p-2 bg-white">{u.nombre}</td>
                      <td className="border p-2 bg-white">{u.correo}</td>
                      <td className="border p-2 bg-white">{u.rol}</td>
                      <td className="border p-2 bg-white">
                        {/* BOTONES CON ESTILOS DEL PRIMER CÓDIGO */}
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            className="px-3 py-1 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626] transition"
                          >
                            Eliminar
                          </button>
                          <button
                            className="px-3 py-1 bg-[#EAB308] text-white rounded-md hover:bg-[#CA8A04] transition"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {nuevoUsuario && (
              <div className="fixed inset-0 bg-[#000000] bg-opacity-40 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Nuevo Usuario</h2>
                  
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nuevoUsuario.nombre}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                    }
                    className="border p-2 w-full mb-2 rounded"
                  />
                  
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={""}
                    onChange={() => {}}
                    className="border p-2 w-full mb-2 rounded"
                  />
                  
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={nuevoUsuario.correo}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
                    }
                    className="border p-2 w-full mb-2 rounded"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={""}
                    onChange={() => {}}
                    className="border p-2 w-full mb-2 rounded"
                  />
                  
                  <select
                    value={""}
                    onChange={() => {}}
                    className="border p-2 w-full mb-2 rounded"
                  >
                    <option value="">Seleccionar sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  
                  <select
                    value={nuevoUsuario.rol}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                    }
                    className="border p-2 w-full mb-2 rounded"
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cliente">Cliente</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                  
                  <input
                    type="password"
                    placeholder="password"
                    value={""}
                    onChange={() => {}}
                    className="border p-2 w-full mb-4 rounded"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNuevoUsuario(null)}
                      className="px-4 py-2 bg-[#9ca3af] rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#2563eb] text-white rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}