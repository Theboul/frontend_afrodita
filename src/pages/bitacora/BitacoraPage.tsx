import { useEffect, useState } from 'react';
import { useBitacora } from '../../hooks/useBitacora';
import BitacoraFiltros from '../../components/bitacora/BitacoraFiltros';
import Paginacion from '../../components/bitacora/Paginacion';
import LogsList from '../../components/bitacora/LogsList';
import EstadisticasPanel from '../../components/bitacora/EstadisticasPanel';
import { type BitacoraFilters } from '../../services/bitacora/bitacoraService';

export default function BitacoraPage() {
  const { 
    logs, 
    loading, 
    error, 
    pagination, 
    loadLogs, 
    clearError,
    estadisticas,
    estadisticasLoading,
    loadEstadisticas 
  } = useBitacora();
  
  const [currentFilters, setCurrentFilters] = useState<BitacoraFilters>({});
  const [showEstadisticas, setShowEstadisticas] = useState(false);

  useEffect(() => {
    loadLogs(1, 20);
    loadEstadisticas(7);
  }, [loadLogs, loadEstadisticas]);

  const handleFilter = (filters: BitacoraFilters) => {
    setCurrentFilters(filters);
    loadLogs(1, pagination.pageSize, filters);
  };

  const handlePageChange = (page: number) => {
    loadLogs(page, pagination.pageSize, currentFilters);
  };

  const handleRefresh = () => {
    loadLogs(1, pagination.pageSize, currentFilters);
    loadEstadisticas(7);
  };

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-8 py-4">
      {/* Header con acciones */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Bitácora del Sistema
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Registro de actividades y eventos del sistema
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          <button
            onClick={() => setShowEstadisticas(!showEstadisticas)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto"
          >
            {showEstadisticas ? 'Ocultar Estadísticas' : 'Ver Estadísticas'}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium w-full sm:w-auto"
          >
            Actualizar
          </button>
        </div>
      </header>

      {/* Panel de Estadísticas */}
      {showEstadisticas && (
        <div className="w-full overflow-x-auto">
          <EstadisticasPanel 
            estadisticas={estadisticas} 
            loading={estadisticasLoading} 
          />
        </div>
      )}

      {/* Filtros */}
      <section className="w-full">
        <BitacoraFiltros onFilter={handleFilter} loading={loading} />
      </section>

      {/* Mensaje de Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-lg font-bold self-end sm:self-auto"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Panel de logs */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header del panel */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Registros de Actividad
              </h2>
              {pagination.totalItems > 0 && !loading && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {pagination.totalItems} registros encontrados
                  {Object.keys(currentFilters).length > 0 && ' (filtrados)'}
                </p>
              )}
            </div>

            {pagination.totalItems > 0 && !loading && (
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de logs */}
        <div className="overflow-x-auto">
          <LogsList logs={logs} loading={loading} />
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-2 sm:px-4 py-3">
            <Paginacion
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </section>
    </div>
  );
}