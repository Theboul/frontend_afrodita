import { useState } from 'react';
import { type BitacoraFilters } from '../../services/bitacora/bitacoraService';

interface BitacoraFiltrosProps {
  onFilter: (filters: BitacoraFilters) => void;
  loading: boolean;
}

const ACCIONES_OPTIONS = [
  { value: 'LOGIN', label: 'Inicio de sesión' },
  { value: 'LOGOUT', label: 'Cierre de sesión' },
  { value: 'FAILED_LOGIN', label: 'Intento fallido' },
  { value: 'PRODUCT_VIEW', label: 'Vista de producto' },
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda general */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Descripción, IP, usuario..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filtro por acción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acción
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha desde
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha hasta
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
            />
          </div>
        </div>
      )}

      {showFilters && (
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}