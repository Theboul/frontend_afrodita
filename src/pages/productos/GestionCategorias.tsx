import { useEffect, useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { CategoriaService } from "../../services/productos/categoriaService";

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    CategoriaService.listar().then(res => setCategorias(res.data));
  }, []);

  return (
    <ModuleLayout title="Gestión de Categorías">
      <Button label="+ Nueva Categoría" color="success" />

      <Table headers={["Nombre", "Acciones"]}>
        {categorias.map(cat => (
          <tr key={cat.id_categoria}>
            <td className="border p-2 bg-white">{cat.nombre}</td>
            <td className="border p-2 bg-white text-center space-x-2">
              <Button label="Editar" color="warning" />
              <Button label="Eliminar" color="danger" />
            </td>
          </tr>
        ))}
      </Table>
    </ModuleLayout>
  );
}
