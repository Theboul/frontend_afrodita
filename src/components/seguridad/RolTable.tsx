import Table from "../ui/Table";
import Badge from "../ui/Badge";
import { type Rol } from "../../services/seguridad/seguridadService";

interface RolTableProps {
  roles: Rol[];
  onEdit: (id: number) => void;
  onDelete: (id: number, nombre: string) => void;
  onVerUsuarios: (id: number, nombre: string) => void;
  onVerPermisos: (id: number, nombre: string) => void;
}

export default function RolTable({ roles, onEdit, onDelete, onVerUsuarios, onVerPermisos }: RolTableProps) {
  return (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-pink-200">
      <Table headers={["Nombre", "Descripción", "Permisos", "Estado", "Acciones"]}>
        {roles.map((rol) => (
          <tr key={rol.id_rol} className="border-b hover:bg-pink-50 transition-colors">
            <td className="px-3 md:px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-pink-800 text-sm md:text-base">
                  {rol.nombre}
                </span>
                {rol.es_sistema && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sistema
                  </span>
                )}
              </div>
            </td>
            <td className="px-3 md:px-4 py-3 text-pink-700 text-xs md:text-sm">
              {rol.descripcion || "-"}
            </td>
            <td className="px-3 md:px-4 py-3 text-center">
              <button
                onClick={() => onVerPermisos(rol.id_rol, rol.nombre)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all hover:shadow-md text-sm font-medium"
                title="Ver permisos del rol"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {rol.cantidad_permisos}
              </button>
            </td>
            <td className="px-3 md:px-4 py-3 text-center">
              <Badge variant={rol.activo ? "success" : "danger"} size="sm">
                {rol.activo ? "Activo" : "Inactivo"}
              </Badge>
            </td>
            <td className="px-3 md:px-4 py-3 text-center">
              <div className="flex justify-center gap-1 flex-wrap">
                <button
                  onClick={() => onVerUsuarios(rol.id_rol, rol.nombre)}
                  className="text-purple-600 hover:text-purple-800 transition-colors p-2 hover:bg-purple-50 rounded"
                  title="Ver Usuarios"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(rol.id_rol)}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {!rol.es_sistema && (
                  <button
                    onClick={() => onDelete(rol.id_rol, rol.nombre)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}