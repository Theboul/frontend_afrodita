import { useState, useEffect } from 'react';
import { seguridadService, type Permiso } from '../services/seguridad/seguridadService';
import { toast } from 'react-hot-toast';

export const usePermisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPermisos = async (filtros?: { 
    modulo?: string; 
    activo?: boolean; 
    search?: string 
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seguridadService.obtenerPermisos(filtros);
      if (response.success) {
        setPermisos(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      const mensaje = err.response?.data?.message || err.message || 'Error al cargar permisos';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const crearPermiso = async (data: {
    nombre: string;
    codigo: string;
    descripcion?: string;
    modulo: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.crearPermiso(data);
      if (response.success) {
        toast.success(response.message || 'Permiso creado exitosamente');
        await cargarPermisos();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear permiso';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPermiso = async (id: number, data: Partial<Permiso>): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.actualizarPermiso(id, data);
      if (response.success) {
        toast.success(response.message || 'Permiso actualizado exitosamente');
        await cargarPermisos();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar permiso';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const eliminarPermiso = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.eliminarPermiso(id);
      if (response.success) {
        toast.success(response.message || 'Permiso eliminado exitosamente');
        await cargarPermisos();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar permiso';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  return {
    permisos,
    loading,
    error,
    cargarPermisos,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso,
  };
};