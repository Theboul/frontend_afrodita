import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";
import EmptyState from "../ui/EmptyState";
import Badge from "../ui/Badge";
import { seguridadService } from "../../services/seguridad/seguridadService";
import { toast } from "react-hot-toast";

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  estado_usuario: string;
}

interface UsuariosRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolId: number;
  rolNombre: string;
}

export default function UsuariosRolModal({
  isOpen,
  onClose,
  rolId,
  rolNombre,
}: UsuariosRolModalProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && rolId) {
      cargarUsuarios();
    }
  }, [isOpen, rolId]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await seguridadService.obtenerUsuariosConRol(rolId);
      
      if (response.success) {
        setUsuarios(response.data || []);
      } else {
        toast.error(response.message || "Error al cargar usuarios del rol");
        setUsuarios([]);
      }
    } catch (error: any) {
      // No mostrar error si el endpoint no está implementado
      if (error.response?.status !== 500) {
        toast.error(error.response?.data?.message || "Error al cargar usuarios del rol");
      }
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Usuarios con rol: ${rolNombre}`} maxWidth="lg">
      {loading ? (
        <Loading message="Cargando usuarios..." />
      ) : usuarios.length === 0 ? (
        <EmptyState message="No hay usuarios con este rol" />
      ) : (
        <div className="space-y-3">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id_usuario}
              className="border border-pink-200 rounded-lg p-4 hover:bg-pink-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-800 text-sm md:text-base">
                    {usuario.nombre_completo}
                  </h3>
                  <p className="text-xs md:text-sm text-pink-600">
                    @{usuario.nombre_usuario}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {usuario.correo}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={usuario.estado_usuario === "ACTIVO" ? "success" : "danger"}
                    size="sm"
                  >
                    {usuario.estado_usuario}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        Total: <span className="font-semibold text-pink-700">{usuarios.length}</span> usuario(s)
      </div>
    </Modal>
  );
}