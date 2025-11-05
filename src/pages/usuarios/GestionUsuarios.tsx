import { useState, useEffect } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Button from "../../components/ui/Button";
import TablaUsuarios from "../../components/usuario/TablaUsuarios";
import ModalConfirmacion from "../../components/usuario/ModalConfirmacion";
import ModalCambiarEstado from "../../components/usuario/ModalCambiarEstado";
import ModalCambiarContrasena from "../../components/usuario/ModalCambiarContrasena";
import ModalDirecciones from "../../components/usuario/ModalDirecciones";
import FormularioUsuario from "../../components/usuario/FormularioUsuario";
import { useUsuarios } from "../../hooks/useUsuarios";
import type { Usuario, UsuarioCreate } from "../../services/usuarios/gestionUsuario";
import { debug } from "../../utils/debug";

export default function GestionUsuarios() {
  const {
    usuarios,
    loading,
    error,
    paginacion,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstado,
    cambiarContrasena,
    setPaginacion
  } = useUsuarios();

  // Agregar useEffect para debug
  useEffect(() => {
    debug.log("📊 Estado actual:", {
      usuarios,
      loading,
      error,
      paginacion
    });
  }, [usuarios, loading, error, paginacion]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState<{ show: boolean; usuario: Usuario | null }>({
    show: false,
    usuario: null
  });
  const [modalEliminar, setModalEliminar] = useState<{ show: boolean; usuarioId: number | null }>({
    show: false,
    usuarioId: null
  });
  const [modalCambiarEstado, setModalCambiarEstado] = useState<{ show: boolean; usuario: Usuario | null }>({
    show: false,
    usuario: null
  });
  const [modalCambiarContrasena, setModalCambiarContrasena] = useState<{ show: boolean; usuario: Usuario | null }>({
    show: false,
    usuario: null
  });
  const [modalDirecciones, setModalDirecciones] = useState<{ show: boolean; usuario: Usuario | null }>({
    show: false,
    usuario: null
  });

  const handleCrearUsuario = async (datos: UsuarioCreate) => {
    const success = await crearUsuario(datos);
    if (success) {
      setModalCrear(false);
    }
    return success;
  };

  const handleEditarUsuario = async (datos: Partial<UsuarioCreate>) => {
    if (!modalEditar.usuario) return false;
    const success = await actualizarUsuario(modalEditar.usuario.id_usuario, datos);
    if (success) {
      setModalEditar({ show: false, usuario: null });
    }
    return success;
  };

  const handleEliminarUsuario = async () => {
    if (!modalEliminar.usuarioId) return;
    const success = await eliminarUsuario(modalEliminar.usuarioId);
    if (success) {
      setModalEliminar({ show: false, usuarioId: null });
    }
  };

  const handleCambiarEstado = async (nuevoEstado: string, motivo?: string) => {
    if (!modalCambiarEstado.usuario) return false;
    const success = await cambiarEstado(modalCambiarEstado.usuario.id_usuario, nuevoEstado, motivo);
    if (success) {
      setModalCambiarEstado({ show: false, usuario: null });
    }
    return success;
  };

  const handleCambiarContrasena = async (nuevaContrasena: string) => {
    if (!modalCambiarContrasena.usuario) return false;
    const success = await cambiarContrasena(modalCambiarContrasena.usuario.id_usuario, nuevaContrasena);
    if (success) {
      setModalCambiarContrasena({ show: false, usuario: null });
    }
    return success;
  };

  const handleNuevoUsuario = () => {
    setModalCrear(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setModalEditar({ show: true, usuario });
  };

  const handleVerDirecciones = (usuario: Usuario) => {
    setModalDirecciones({ show: true, usuario });
  };

  // Agregar estado de carga más explícito
  if (loading) {
    return (
      <ModuleLayout title="Gestión de Usuarios">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Gestión de Usuarios">
      {/* Header con botón y estadísticas */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Total: {paginacion?.total || 0} usuarios
          </p>
          {/* Debug info - solo visible si está habilitado */}
          {import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
            <p className="text-xs text-gray-400">
              Total: {usuarios.length} usuarios cargados
            </p>
          )}
        </div>
        <Button 
          label="+ Nuevo Usuario" 
          color="success" 
          onClick={handleNuevoUsuario}
        />
      </div>

      {/* Filtros (placeholder) */}
      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <p className="text-sm sm:text-base text-gray-600">Filtros (próximamente)...</p>
      </div>

      {/* Tabla de usuarios */}
      <TablaUsuarios
        usuarios={usuarios}
        loading={loading}
        onEditar={handleEditar}
        onEliminar={(id) => setModalEliminar({ show: true, usuarioId: id })}
        onCambiarEstado={(usuario) => setModalCambiarEstado({ show: true, usuario })}
        onCambiarContrasena={(usuario) => setModalCambiarContrasena({ show: true, usuario })}
        onVerDirecciones={handleVerDirecciones}
      />

      {/* Paginación */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
          Mostrando {((paginacion?.page || 1) - 1) * (paginacion?.pageSize || 10) + 1} a{' '}
          {Math.min((paginacion?.page || 1) * (paginacion?.pageSize || 10), paginacion?.total || 0)} de{' '}
          {paginacion?.total || 0} usuarios
        </div>
        <div className="flex space-x-2 justify-center">
          <Button
            label="Anterior"
            color="info"
            disabled={paginacion.page === 1}
            onClick={() => setPaginacion(paginacion.page - 1)}
          />
          <Button
            label="Siguiente"
            color="info"
            disabled={paginacion.page >= paginacion.totalPages}
            onClick={() => setPaginacion(paginacion.page + 1)}
          />
        </div>
      </div>

      {/* Modal de Crear Usuario */}
      {modalCrear && (
        <FormularioUsuario
          onSubmit={handleCrearUsuario as (datos: UsuarioCreate | Partial<UsuarioCreate>) => Promise<boolean>}
          onCancel={() => setModalCrear(false)}
          loading={loading}
        />
      )}

      {/* Modal de Editar Usuario */}
      {modalEditar.show && modalEditar.usuario && (
        <FormularioUsuario
          usuario={modalEditar.usuario}
          onSubmit={handleEditarUsuario as (datos: UsuarioCreate | Partial<UsuarioCreate>) => Promise<boolean>}
          onCancel={() => setModalEditar({ show: false, usuario: null })}
          loading={loading}
        />
      )}

      {/* Modal de eliminación */}
      {modalEliminar.show && modalEliminar.usuarioId && (
        <ModalConfirmacion
          show={modalEliminar.show}
          titulo="Eliminar Usuario"
          mensaje="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
          onConfirm={handleEliminarUsuario}
          onCancel={() => setModalEliminar({ show: false, usuarioId: null })}
        />
      )}

      {/* Modal de cambiar estado */}
      {modalCambiarEstado.show && modalCambiarEstado.usuario && (
        <ModalCambiarEstado
          show={modalCambiarEstado.show}
          usuario={modalCambiarEstado.usuario}
          onConfirm={handleCambiarEstado}
          onCancel={() => setModalCambiarEstado({ show: false, usuario: null })}
        />
      )}

      {/* Modal de cambiar contraseña */}
      {modalCambiarContrasena.show && modalCambiarContrasena.usuario && (
        <ModalCambiarContrasena
          show={modalCambiarContrasena.show}
          usuario={modalCambiarContrasena.usuario}
          onConfirm={handleCambiarContrasena}
          onCancel={() => setModalCambiarContrasena({ show: false, usuario: null })}
        />
      )}

      {/* Modal de direcciones */}
      {modalDirecciones.show && modalDirecciones.usuario && (
        <ModalDirecciones
          show={modalDirecciones.show}
          usuario={modalDirecciones.usuario}
          onCancel={() => setModalDirecciones({ show: false, usuario: null })}
        />
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
          Error: {error}
        </div>
      )}

      {/* Estado vacío */}
      {!loading && usuarios.length === 0 && !error && (
        <div className="mt-8 text-center py-8 sm:py-12 bg-gray-50 rounded-lg px-4">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-4">👥</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">No se encontraron usuarios en el sistema.</p>
          <Button 
            label="Crear primer usuario" 
            color="success" 
            onClick={handleNuevoUsuario}
          />
        </div>
      )}
    </ModuleLayout>
  );
}