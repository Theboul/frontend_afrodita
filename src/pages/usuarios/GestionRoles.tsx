import { useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function GestionRoles() {
  const [roles, setRoles] = useState<Rol[]>([
    { id: 1, nombre: "Administrador", descripcion: "Acceso total" },
    { id: 2, nombre: "Vendedor", descripcion: "Puede gestionar ventas" },
  ]);
  const [nuevo, setNuevo] = useState({ nombre: "", descripcion: "" });

  const agregar = () => {
    if (!nuevo.nombre) return;
    setRoles([...roles, { id: roles.length + 1, ...nuevo }]);
    setNuevo({ nombre: "", descripcion: "" });
  };

  const eliminar = (id: number) => setRoles(roles.filter((r) => r.id !== id));

  return (
    <ModuleLayout title="Gestión de Roles">
      {/* Formulario Agregar */}
      <Card title="Agregar Rol">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Nombre del rol"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
          />
          <input
            placeholder="Descripción"
            value={nuevo.descripcion}
            onChange={(e) =>
              setNuevo({ ...nuevo, descripcion: e.target.value })
            }
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <Button label="Guardar Rol" color="info" onClick={agregar} />
      </Card>

      {/* Tabla Desktop */}
      <div className="hidden md:block overflow-x-auto shadow-sm rounded-lg border border-pink-200 mt-4">
        <Table headers={["ID", "Nombre", "Descripción", "Acciones"]}>
          {roles.map((r) => (
            <tr key={r.id} className="border-b hover:bg-pink-50 transition-colors">
              <td className="px-4 py-2 text-pink-700">{r.id}</td>
              <td className="px-4 py-2 text-pink-800">{r.nombre}</td>
              <td className="px-4 py-2 text-pink-700">{r.descripcion}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <Button label="Editar" color="info" />
                <Button
                  label="Eliminar"
                  color="info"
                  onClick={() => eliminar(r.id)}
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden mt-4 space-y-4">
        {roles.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-pink-200 rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-pink-800 font-semibold">{r.nombre}</span>
              <span className="text-pink-600 font-medium">ID: {r.id}</span>
            </div>
            <p className="text-pink-700 mb-2">{r.descripcion}</p>
            <div className="flex gap-2">
              <Button label="Editar" color="info" />
              <Button
                label="Eliminar"
                color="info"
                onClick={() => eliminar(r.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}