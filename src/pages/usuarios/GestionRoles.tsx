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

  const eliminar = (id: number) => setRoles(roles.filter(r => r.id !== id));

  return (
    <ModuleLayout title="Gestión de Roles">
      <Card title="Agregar Rol">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Nombre del rol"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
          />
          <input
            placeholder="Descripción"
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <Button label="Guardar Rol" color="success" onClick={agregar} />
      </Card>

      <Table headers={["ID", "Nombre", "Descripción", "Acciones"]}>
        {roles.map(r => (
          <tr key={r.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{r.id}</td>
            <td className="px-4 py-2">{r.nombre}</td>
            <td className="px-4 py-2">{r.descripcion}</td>
            <td className="px-4 py-2 text-center space-x-2">
              <Button label="Editar" color="warning" />
              <Button label="Eliminar" color="danger" onClick={() => eliminar(r.id)} />
            </td>
          </tr>
        ))}
      </Table>
    </ModuleLayout>
  );
}
