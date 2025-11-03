import { useState, useEffect } from 'react';
import { type Usuario } from '../../services/usuarios/gestionUsuario';
import {
  type Direccion,
  type DireccionCreate,
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion as eliminarDireccionService,
  marcarDireccionPrincipal as marcarPrincipalService
} from '../../services/direcciones/direccionesService';
import FormularioDireccion from './FormularioDireccion';

interface ModalDireccionesProps {
  show: boolean;
  usuario: Usuario | null;
  onCancel: () => void;
}

export default function ModalDirecciones({ show, usuario, onCancel }: ModalDireccionesProps) {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState<Direccion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show && usuario) {
      cargarDirecciones();
    }
  }, [show, usuario]);

  const cargarDirecciones = async () => {
    if (!usuario) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("🏠 [Modal] Cargando direcciones del usuario:", usuario.id_usuario);
      const response = await obtenerDirecciones(usuario.id_usuario);
      console.log("🏠 [Modal] Respuesta:", response);
      
      if (response.success && response.data) {
        const direccionesData = response.data.direcciones || response.data;
        setDirecciones(Array.isArray(direccionesData) ? direccionesData : []);
        console.log("✅ [Modal] Direcciones cargadas:", direccionesData);
      } else {
        setError(response.message || 'Error al cargar direcciones');
        setDirecciones([]);
      }
    } catch (error: any) {
      console.error('❌ [Modal] Error al cargar direcciones:', error);
      setError('Error de conexión al cargar direcciones');
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDireccion = async (direccionId: number) => {
    if (!usuario) return;
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) {
      return;
    }

    try {
      console.log("🗑️ [Modal] Eliminando dirección:", direccionId);
      const response = await eliminarDireccionService(usuario.id_usuario, direccionId);
      console.log("🗑️ [Modal] Respuesta:", response);

      if (response.success) {
        await cargarDirecciones();
        alert('Dirección eliminada correctamente');
      } else {
        alert(response.message || 'Error al eliminar dirección');
      }
    } catch (error: any) {
      console.error('❌ [Modal] Error al eliminar:', error);
      alert('Error de conexión al eliminar dirección');
    }
  };

  const handleMarcarPrincipal = async (direccionId: number) => {
    if (!usuario) return;

    try {
      console.log("⭐ [Modal] Marcando como principal:", direccionId);
      const response = await marcarPrincipalService(usuario.id_usuario, direccionId);
      console.log("⭐ [Modal] Respuesta:", response);

      if (response.success) {
        await cargarDirecciones();
        alert('Dirección marcada como principal');
      } else {
        alert(response.message || 'Error al marcar como principal');
      }
    } catch (error: any) {
      console.error('❌ [Modal] Error al marcar principal:', error);
      alert('Error de conexión');
    }
  };

  const handleAbrirFormulario = (direccion?: Direccion) => {
    setDireccionEditando(direccion || null);
    setModoEdicion(true);
  };

  const handleCerrarFormulario = () => {
    setModoEdicion(false);
    setDireccionEditando(null);
  };

  const handleSubmitDireccion = async (datos: DireccionCreate) => {
    if (!usuario) return;
    
    setSubmitting(true);

    try {
      let response;
      
      if (direccionEditando) {
        // Actualizar dirección existente
        console.log("✏️ [Modal] Actualizando dirección:", direccionEditando.id_direccion);
        response = await actualizarDireccion(
          usuario.id_usuario,
          direccionEditando.id_direccion,
          datos
        );
      } else {
        // Crear nueva dirección
        console.log("➕ [Modal] Creando nueva dirección");
        response = await crearDireccion(usuario.id_usuario, datos);
      }

      console.log("📝 [Modal] Respuesta guardar:", response);

      if (response.success) {
        alert(direccionEditando 
          ? 'Dirección actualizada correctamente' 
          : 'Dirección creada correctamente'
        );
        handleCerrarFormulario();
        await cargarDirecciones();
      } else {
        alert(response.message || 'Error al guardar la dirección');
      }
    } catch (error: any) {
      console.error('❌ [Modal] Error al guardar:', error);
      alert('Error de conexión al guardar la dirección');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Direcciones de {usuario?.nombre_completo}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-600">Cargando direcciones...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">⚠️ {error}</p>
              <button 
                onClick={cargarDirecciones}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : modoEdicion ? (
            <FormularioDireccion
              direccion={direccionEditando}
              onSubmit={handleSubmitDireccion}
              onCancel={handleCerrarFormulario}
              loading={submitting}
            />
          ) : direcciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 mb-4">Este cliente no tiene direcciones registradas</p>
              <button 
                onClick={() => handleAbrirFormulario()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Agregar Primera Dirección
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {direcciones.map((direccion) => (
                  <DireccionCard
                    key={direccion.id_direccion}
                    direccion={direccion}
                    onEditar={() => handleAbrirFormulario(direccion)}
                    onEliminar={() => handleEliminarDireccion(direccion.id_direccion)}
                    onMarcarPrincipal={() => handleMarcarPrincipal(direccion.id_direccion)}
                  />
                ))}
              </div>

              <button 
                onClick={() => handleAbrirFormulario()}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                + Agregar Nueva Dirección
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar cada tarjeta de dirección
interface DireccionCardProps {
  direccion: Direccion;
  onEditar: () => void;
  onEliminar: () => void;
  onMarcarPrincipal: () => void;
}

function DireccionCard({ direccion, onEditar, onEliminar, onMarcarPrincipal }: DireccionCardProps) {
  const iconos: Record<string, string> = {
    'Casa': '🏠',
    'Trabajo': '🏢',
    'Oficina': '🏢',
  };

  const icono = iconos[direccion.etiqueta] || '📍';

  return (
    <div className={`border-2 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md ${
      direccion.es_principal ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl">{icono}</span>
          <span className="font-semibold text-gray-900 text-base sm:text-lg">
            {direccion.etiqueta || 'Sin etiqueta'}
          </span>
          {direccion.es_principal && (
            <span className="px-2 sm:px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold">
              ⭐ Principal
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-900 font-medium text-sm sm:text-base">{direccion.direccion}</p>
        
        {(direccion.ciudad || direccion.departamento || direccion.pais) && (
          <p className="text-gray-600 text-xs sm:text-sm">
            {[direccion.ciudad, direccion.departamento, direccion.pais]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}

        {direccion.referencia && (
          <p className="text-gray-600 text-xs sm:text-sm italic">
            <strong>Ref:</strong> {direccion.referencia}
          </p>
        )}

        <p className="text-gray-400 text-xs">
          Creada: {new Date(direccion.fecha_creacion).toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <button 
          onClick={onEditar}
          className="px-3 py-2 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition-colors text-xs sm:text-sm font-medium"
          title="Editar dirección"
        >
          ✏️ Editar
        </button>

        {!direccion.es_principal && (
          <button 
            onClick={onMarcarPrincipal}
            className="px-3 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium"
            title="Marcar como principal"
          >
            ⭐ Marcar Principal
          </button>
        )}

        <button 
          onClick={onEliminar}
          className="px-3 py-2 bg-red-100 text-red-900 rounded hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium"
          title="Eliminar dirección"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}