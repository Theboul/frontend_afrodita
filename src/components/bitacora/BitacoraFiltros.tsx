import { useState } from 'react';
import { type BitacoraFilters } from '../../services/bitacora/bitacoraService';

interface BitacoraFiltrosProps {
  onFilter: (filters: BitacoraFilters) => void;
  loading: boolean;
}

const ACCIONES_OPTIONS = [
  // =====================================================
  // Autenticación y sesiones
  // =====================================================
  { value: 'LOGIN', label: 'Inicio de sesión' },
  { value: 'LOGOUT', label: 'Cierre de sesión' },
  { value: 'LOGOUT_ERROR', label: 'Error al cerrar sesión' },
  { value: 'FAILED_LOGIN', label: 'Intento fallido de inicio de sesión' },
  { value: 'TOKEN_INVALIDATION', label: 'Invalidación de token' },

  // =====================================================
  // Gestión de usuarios
  // =====================================================
  { value: 'REGISTER', label: 'Registro de usuario' },
  { value: 'PASSWORD_CHANGE', label: 'Cambio de contraseña' },
  { value: 'PASSWORD_RESET', label: 'Reseteo de contraseña' },
  { value: 'PROFILE_UPDATE', label: 'Actualización de perfil' },
  { value: 'DELETE_ACCOUNT', label: 'Eliminación de cuenta' },
  { value: 'PERMISSION_CHANGE', label: 'Cambio de permisos' },

  // =====================================================
  // Navegación y acceso
  // =====================================================
  { value: 'VIEW_ACCESS', label: 'Acceso a vista' },
  { value: 'PAGE_VIEW', label: 'Vista de página' },
  { value: 'PRODUCT_VIEW', label: 'Vista de producto' },

  // =====================================================
  // Usuarios anónimos
  // =====================================================
  { value: 'ANONYMOUS_VIEW', label: 'Vista de usuario anónimo' },
  { value: 'ANONYMOUS_PRODUCT_VIEW', label: 'Vista de producto por usuario anónimo' },
  { value: 'ANONYMOUS_SEARCH', label: 'Búsqueda por usuario anónimo' },

  // =====================================================
  // Gestión de categorías
  // =====================================================
  { value: 'CATEGORY_CREATE', label: 'Creación de categoría' },
  { value: 'CATEGORY_UPDATE', label: 'Actualización de categoría' },
  { value: 'CATEGORY_MOVE', label: 'Movimiento de categoría' },
  { value: 'CATEGORY_DELETE', label: 'Eliminación lógica de categoría' },
  { value: 'CATEGORY_RESTORE', label: 'Restauración de categoría' },

  // =====================================================
  // Gestión de productos
  // =====================================================
  { value: 'PRODUCT_CREATE', label: 'Creación de producto' },
  { value: 'PRODUCT_UPDATE', label: 'Actualización de producto' },
  { value: 'PRODUCT_DELETE', label: 'Eliminación de producto' },
  { value: 'PRODUCT_STATE_CHANGE', label: 'Cambio de estado de producto' },
  { value: 'PRODUCT_STOCK_ADJUST', label: 'Ajuste de stock de producto' },

  // =====================================================
  // Gestión de imágenes del catálogo
  // =====================================================
  { value: 'IMAGE_UPLOAD', label: 'Subida de imagen de producto' },
  { value: 'IMAGE_DELETE', label: 'Eliminación de imagen de producto' },
  { value: 'IMAGE_SET_MAIN', label: 'Cambio de imagen principal' },
  { value: 'IMAGE_REORDER', label: 'Reordenamiento de imágenes' },
  { value: 'IMAGE_RESTORE', label: 'Restauración de imagen de producto' },
  { value: 'IMAGE_UPDATE', label: 'Actualización de metadatos de imagen' },

  // =====================================================
  // Errores y seguridad
  // =====================================================
  { value: 'ERROR_404', label: 'Página no encontrada' },
  { value: 'ERROR_500', label: 'Error interno del servidor' },
  { value: 'SUSPICIOUS_ACTIVITY', label: 'Actividad sospechosa' },
];

export default function BitacoraFiltros({ onFilter, loading }: BitacoraFiltrosProps) {
  const [filters, setFilters] = useState<BitacoraFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof BitacoraFilters, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-purple-600 hover:text-purple-800 font-medium text-sm sm:text-base self-start sm:self-auto"
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Búsqueda general */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Descripción, IP, usuario..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filtro por acción */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Acción
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('accion', e.target.value)}
            >
              <option value="">Todas las acciones</option>
              {ACCIONES_OPTIONS.map(accion => (
                <option key={accion.value} value={accion.value}>
                  {accion.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Fecha desde
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Fecha hasta
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
            />
          </div>
        </div>
      )}

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}