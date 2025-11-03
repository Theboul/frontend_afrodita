// hooks/useUsuarios.ts - Versión limpia
import { useState, useEffect, useCallback } from 'react';
import { 
  UsuarioService, 
  type Usuario, 
  type UsuarioCreate, 
  type FiltrosUsuarios 
} from '../services/usuarios/gestionUsuario';

interface UseUsuariosReturn {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  paginacion: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filtros: FiltrosUsuarios;
  cargarUsuarios: () => Promise<void>;
  crearUsuario: (datos: UsuarioCreate) => Promise<boolean>;
  actualizarUsuario: (id: number, datos: Partial<UsuarioCreate>) => Promise<boolean>;
  eliminarUsuario: (id: number) => Promise<boolean>;
  cambiarEstado: (id: number, estado: string, motivo?: string) => Promise<boolean>;
  cambiarContrasena: (id: number, nuevaContrasena: string) => Promise<boolean>;
  setFiltros: (filtros: FiltrosUsuarios) => void;
  setPaginacion: (page: number) => void;
  clearError: () => void;
}

export const useUsuarios = (): UseUsuariosReturn => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacionState] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [filtros, setFiltrosState] = useState<FiltrosUsuarios>({});

  const clearError = useCallback(() => setError(null), []);

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await UsuarioService.listar({
        ...filtros,
        page: paginacion.page,
        pageSize: paginacion.pageSize
      });
      
      if (response.success && response.data) {
        setUsuarios(response.data.results || []);
        setPaginacionState(prev => ({
          ...prev,
          total: response.data?.count || 0,
          totalPages: Math.ceil((response.data?.count || 0) / paginacion.pageSize)
        }));
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Error al cargar usuarios';
      setError(errorMessage);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacion.page, paginacion.pageSize, clearError]);

  const crearUsuario = async (datos: UsuarioCreate): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await UsuarioService.crear(datos);
      await cargarUsuarios();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          'Error al crear usuario';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const actualizarUsuario = async (id: number, datos: Partial<UsuarioCreate>): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await UsuarioService.actualizar(id, datos);
      await cargarUsuarios();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          'Error al actualizar usuario';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await UsuarioService.eliminar(id);
      setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          'Error al eliminar usuario';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, estado: string, motivo?: string): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await UsuarioService.cambiarEstado(id, estado, motivo);
      await cargarUsuarios();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          'Error al cambiar estado';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cambiarContrasena = async (id: number, nuevaContrasena: string): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await UsuarioService.cambiarContrasena(id, nuevaContrasena);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          'Error al cambiar contraseña';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setFiltros = useCallback((newFiltros: FiltrosUsuarios) => {
    setFiltrosState(newFiltros);
    setPaginacionState(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPaginacion = useCallback((page: number) => {
    setPaginacionState(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  return {
    usuarios,
    loading,
    error,
    paginacion,
    filtros,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstado,
    cambiarContrasena,
    setFiltros,
    setPaginacion,
    clearError
  };
};