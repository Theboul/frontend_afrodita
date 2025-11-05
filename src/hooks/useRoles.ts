import { useState, useEffect } from 'react';
import { seguridadService, type Rol, type RolDetalle } from '../services/seguridad/seguridadService';
import { toast } from 'react-hot-toast';

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarRoles = async (filtros?: { activo?: boolean; es_sistema?: boolean; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seguridadService.obtenerRoles(filtros);
      
      if (response.success) {
        setRoles(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      const mensaje = err.response?.data?.message || err.message || 'Error al cargar roles';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const crearRol = async (data: {
    nombre: string;
    descripcion?: string;
    permisos_ids?: number[];
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.crearRol(data);
      if (response.success) {
        toast.success(response.message || 'Rol creado exitosamente');
        await cargarRoles();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear rol';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const actualizarRol = async (id: number, data: Partial<RolDetalle>): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.actualizarRol(id, data);
      if (response.success) {
        toast.success(response.message || 'Rol actualizado exitosamente');
        await cargarRoles();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar rol';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const eliminarRol = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await seguridadService.eliminarRol(id);
      if (response.success) {
        toast.success(response.message || 'Rol eliminado exitosamente');
        await cargarRoles();
        return true;
      }
      throw new Error(response.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar rol';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    cargarRoles,
    crearRol,
    actualizarRol,
    eliminarRol,
  };
};
