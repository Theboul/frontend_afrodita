import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";
import EmptyState from "../ui/EmptyState";
import Badge from "../ui/Badge";
import { seguridadService, type Permiso } from "../../services/seguridad/seguridadService";
import { toast } from "react-hot-toast";

interface PermisosRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolId: number;
  rolNombre: string;
}

export default function PermisosRolModal({
  isOpen,
  onClose,
  rolId,
  rolNombre,
}: PermisosRolModalProps) {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && rolId) {
      cargarPermisos();
    }
  }, [isOpen, rolId]);

  const cargarPermisos = async () => {
    setLoading(true);
    try {
      const response = await seguridadService.obtenerRol(rolId);
      
      if (response.success && response.data.permisos) {
        setPermisos(response.data.permisos);
      } else {
        setPermisos([]);
      }
    } catch (error: any) {
      toast.error("Error al cargar permisos del rol");
      setPermisos([]);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar permisos por módulo
  const permisosPorModulo = permisos.reduce((acc, permiso) => {
    const modulo = permiso.modulo || "Sin módulo";
    if (!acc[modulo]) {
      acc[modulo] = [];
    }
    acc[modulo].push(permiso);
    return acc;
  }, {} as Record<string, Permiso[]>);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Permisos del rol: ${rolNombre}`} 
      maxWidth="xl"
    >
      {loading ? (
        <Loading message="Cargando permisos..." />
      ) : permisos.length === 0 ? (
        <EmptyState message="Este rol no tiene permisos asignados" />
      ) : (
        <div className="space-y-6">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-pink-900">
                Total de permisos asignados:
              </span>
              <Badge variant="info" size="md">
                {permisos.length}
              </Badge>
            </div>
          </div>

          {Object.entries(permisosPorModulo).map(([modulo, permisosModulo]) => (
            <div key={modulo} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {modulo}
                  </h3>
                  <Badge variant="default" size="sm">
                    {permisosModulo.length}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permisosModulo.map((permiso) => (
                    <div
                      key={permiso.id_permiso}
                      className="border border-gray-200 rounded-lg p-3 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-green-500">✓</span>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {permiso.nombre}
                            </h4>
                          </div>
                          {permiso.descripcion && (
                            <p className="text-xs text-gray-600 mt-1">
                              {permiso.descripcion}
                            </p>
                          )}
                          <div className="mt-2">
                            <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {permiso.codigo}
                            </code>
                          </div>
                        </div>
                        {permiso.activo ? (
                          <Badge variant="success" size="sm">Activo</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">Inactivo</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
