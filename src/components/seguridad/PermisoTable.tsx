import Table from "../ui/Table";
import Badge from "../ui/Badge";
import { type Permiso } from "../../services/seguridad/seguridadService";

interface PermisoTableProps {
  permisos: Permiso[];
  onEdit: (permiso: Permiso) => void;
  onDelete: (id: number, nombre: string) => void;
}

export default function PermisoTable({ permisos, onEdit, onDelete }: PermisoTableProps) {
  return (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-pink-200">
      <Table headers={["Módulo", "Nombre", "Código", "Descripción", "Estado", "Acciones"]}>
        {permisos.map((permiso) => (
          <tr key={permiso.id_permiso} className="border-b hover:bg-pink-50 transition-colors">
            <td className="px-3 md:px-4 py-3">
              <Badge variant="default" size="sm">
                {permiso.modulo}
              </Badge>
            </td>
            <td className="px-3 md:px-4 py-3 font-medium text-pink-800 text-xs md:text-sm">
              {permiso.nombre}
            </td>
            <td className="px-3 md:px-4 py-3 text-pink-700 font-mono text-xs">
              {permiso.codigo}
            </td>
            <td className="px-3 md:px-4 py-3 text-pink-700 text-xs max-w-xs truncate">
              {permiso.descripcion || "-"}
            </td>
            <td className="px-3 md:px-4 py-3 text-center">
              <Badge variant={permiso.activo ? "success" : "danger"} size="sm">
                {permiso.activo ? "Activo" : "Inactivo"}
              </Badge>
            </td>
            <td className="px-3 md:px-4 py-3 text-center">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onEdit(permiso)}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(permiso.id_permiso, permiso.nombre)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}