import Badge from "../ui/Badge";
import { type Permiso } from "../../services/seguridad/seguridadService";

interface PermisoCardProps {
  permiso: Permiso;
  onEdit: (permiso: Permiso) => void;
  onDelete: (id: number, nombre: string) => void;
}

export default function PermisoCard({ permiso, onEdit, onDelete }: PermisoCardProps) {
  return (
    <div className="bg-white border border-pink-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Badge variant="default" size="sm">
            {permiso.modulo}
          </Badge>
          <h3 className="text-base font-semibold text-pink-800 mt-2">
            {permiso.nombre}
          </h3>
          <p className="text-xs text-pink-600 font-mono mt-1">
            {permiso.codigo}
          </p>
        </div>
        <Badge variant={permiso.activo ? "success" : "danger"} size="sm">
          {permiso.activo ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <p className="text-sm text-pink-700 mb-3 line-clamp-2">
        {permiso.descripcion || "Sin descripción"}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(permiso)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={() => onDelete(permiso.id_permiso, permiso.nombre)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  );
}