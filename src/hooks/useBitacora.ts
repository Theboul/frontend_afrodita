import { useState, useCallback } from 'react';
import { 
  bitacoraService, 
  type Bitacora, 
  type PaginatedResponse, 
  type BitacoraFilters, 
  type EstadisticasBitacora, 
  type PaginationInfo 
} from '../services/bitacora/bitacoraService';

export const useBitacora = () => {
  const [logs, setLogs] = useState<Bitacora[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 50,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Cargar logs con paginación
  const loadLogs = useCallback(async (page: number = 1, pageSize: number = 50, filters: BitacoraFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Bitacora> = await bitacoraService.getBitacoraLogs(page, pageSize, filters);
      
      setLogs(response.results);
      setPagination({
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(response.count / pageSize),
        totalItems: response.count,
        hasNext: !!response.next,
        hasPrevious: !!response.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los logs');
      console.error('Error loading bitacora logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const [estadisticas, setEstadisticas] = useState<EstadisticasBitacora | null>(null);
  const [estadisticasLoading, setEstadisticasLoading] = useState(false);

  const loadEstadisticas = useCallback(async (dias: number = 7) => {
    setEstadisticasLoading(true);
    try {
      const data = await bitacoraService.getEstadisticas(dias);
      setEstadisticas(data);
    } catch (err) {
      console.error('Error loading estadísticas:', err);
    } finally {
      setEstadisticasLoading(false);
    }
  }, []);

  return {
    // Logs paginados
    logs,
    loading,
    error,
    pagination,
    loadLogs,
    
    // Estadísticas
    estadisticas,
    estadisticasLoading, 
    loadEstadisticas,
    
    // Utilidades
    clearError: () => setError(null),
  };
};