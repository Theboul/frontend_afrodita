import ModuleLayout from "../../layouts/ModuleLayout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";

export default function GestionArchivos() {
  return (
    <ModuleLayout title="Gestión de Archivos del Catálogo">
      <Button label="+ Nuevo Archivo" color="success" />

      <Table headers={["Nombre", "Tipo", "Acciones"]}>
        <tr>
          <td className="px-4 py-2 bg-white">catalogo.pdf</td>
          <td className="px-4 py-2 bg-white">PDF</td>
          <td className="px-4 py-2 bg-white text-center space-x-2">
            <Button label="Ver" color="info" />
            <Button label="Eliminar" color="danger" />
          </td>
        </tr>
      </Table>
    </ModuleLayout>
  );
}
