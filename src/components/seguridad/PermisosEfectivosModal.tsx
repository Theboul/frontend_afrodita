import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";
import Badge from "../ui/Badge";
import { seguridadService, type Permiso } from "../../services/seguridad/seguridadService";
import { toast } from "react-hot-toast";

interface PermisosEfectivosData {
  usuario: string;
  rol: string;
  permisos_rol: Permiso[];
  permisos_concedidos: Permiso[];
  permisos_revocados: Permiso[];
  permisos_finales: string[];
  total_permisos: number;
}

interface PermisosEfectivosModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  usuarioNombre: string;
}

export default function PermisosEfectivosModal({
  isOpen,
  onClose,
  usuarioId,
  usuarioNombre,
}: PermisosEfectivosModalProps) {
  const [data, setData] = useState<PermisosEfectivosData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && usuarioId) {
      cargarPermisosEfectivos();
    }
  }, [isOpen, usuarioId]);

  const cargarPermisosEfectivos = async () => {
    setLoading(true);
    try {
      const response = await seguridadService.obtenerPermisosEfectivos(usuarioId);
      if (response.success) {
        setData(response.data);
      }
    } catch (error: any) {
      toast.error("Error al cargar permisos efectivos");
    } finally {
      setLoading(false);
    }
  };

  const PermisosList = ({ permisos, titulo, variant }: { 
    permisos: Permiso[]; 
    titulo: string;
    variant: "default" | "success" | "danger";
  }) => (
    <div className="mb-4">
      <h4 className="font-semibold text-pink-700 mb-2 text-sm md:text-base flex items-center gap-2">
        {titulo}
        <Badge variant={variant} size="sm">
          {permisos.length}
        </Badge>
      </h4>
      {permisos.length === 0 ? (
        <p className="text-xs md:text-sm text-gray-500 italic">Ninguno</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {permisos.map((p) => (
            <div
              key={p.id_permiso}
              className="border border-pink-100 rounded p-2 bg-pink-50 text-xs md:text-sm"
            >
              <p className="font-medium text-pink-800">{p.nombre}</p>
              <p className="text-pink-600 text-xs">{p.modulo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permisos Efectivos: ${usuarioNombre}`}
      maxWidth="xl"
    >
      {loading ? (
        <Loading message="Calculando permisos..." />
      ) : !data ? (
        <p className="text-center text-gray-500">No se pudieron cargar los permisos</p>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Usuario:</span>
                <span className="ml-2 font-semibold text-pink-800">{data.usuario}</span>
              </div>
              <div>
                <span className="text-gray-600">Rol:</span>
                <span className="ml-2 font-semibold text-pink-800">{data.rol}</span>
              </div>
            </div>
          </div>

          {/* Permisos del Rol */}
          <PermisosList
            permisos={data.permisos_rol}
            titulo="Permisos del Rol"
            variant="default"
          />

          {/* Permisos Concedidos */}
          {data.permisos_concedidos.length > 0 && (
            <PermisosList
              permisos={data.permisos_concedidos}
              titulo="✅ Permisos Concedidos Individualmente"
              variant="success"
            />
          )}

          {/* Permisos Revocados */}
          {data.permisos_revocados.length > 0 && (
            <PermisosList
              permisos={data.permisos_revocados}
              titulo="❌ Permisos Revocados"
              variant="danger"
            />
          )}

          {/* Resumen Final */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2 text-sm md:text-base">
              Permisos Finales ({data.total_permisos})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.permisos_finales.map((codigo) => (
                <Badge key={codigo} variant="success" size="sm">
                  {codigo}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}