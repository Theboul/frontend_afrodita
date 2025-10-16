import { useEffect, useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { UsuarioService, type Usuario } from "../../services/gestionUsuario";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    UsuarioService.listar().then((res) => setUsuarios(res.data));
  }, []);

  const eliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await UsuarioService.eliminar(id);
    setUsuarios(usuarios.filter((u) => u.id_usuario !== id));
  };

  return (
    <ModuleLayout title="Gestión de Usuarios">
      <Button label="+ Nuevo Usuario" color="success" />

      <Table headers={["Nombre", "Correo", "Rol", "Acciones"]}>
        {usuarios.map((u) => (
          <tr key={u.id_usuario}>
            <td className="px-4 py-2">{u.nombre_usuario}</td>
            <td className="px-4 py-2">{u.correo}</td>
            <td className="px-4 py-2">{u.rol}</td>
            <td className="px-4 py-2 text-center space-x-2">
              <Button label="Editar" color="warning" />
              <Button label="Eliminar" color="danger" onClick={() => eliminar(u.id_usuario)} />
            </td>
          </tr>
        ))}
      </Table>
    </ModuleLayout>
  );
}
