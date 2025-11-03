import { axiosInstance } from '../axiosConfig';

export interface Direccion {
  id_direccion: number;
  etiqueta: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  referencia: string;
  es_principal: boolean;
  fecha_creacion: string;
  guardada: boolean;
}

export interface DireccionCreate {
  etiqueta?: string;
  direccion: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  referencia?: string;
  es_principal?: boolean;
  guardada?: boolean;
}

const API_BASE = '/api/usuarios/admin/usuarios';

/**
 * Obtener todas las direcciones de un usuario
 */
export const obtenerDirecciones = async (idUsuario: number) => {
  const response = await axiosInstance.get(`${API_BASE}/${idUsuario}/direcciones/`);
  return response;
};

/**
 * Crear una nueva dirección para un usuario
 */
export const crearDireccion = async (idUsuario: number, datos: DireccionCreate) => {
  const response = await axiosInstance.post(`${API_BASE}/${idUsuario}/direcciones/`, datos);
  return response;
};

/**
 * Actualizar una dirección existente
 */
export const actualizarDireccion = async (
  idUsuario: number,
  idDireccion: number,
  datos: Partial<DireccionCreate>
) => {
  console.log("✏️ Actualizando dirección:", idDireccion, "del usuario:", idUsuario);
  const response = await axiosInstance.patch(
    `${API_BASE}/${idUsuario}/direcciones/${idDireccion}/`,
    datos
  );
  console.log("✏️ Respuesta actualizar:", response);
  return response;
};

/**
 * Eliminar una dirección (soft delete)
 */
export const eliminarDireccion = async (idUsuario: number, idDireccion: number) => {
  const response = await axiosInstance.delete(`${API_BASE}/${idUsuario}/direcciones/${idDireccion}/`);
  return response;
};

/**
 * Marcar una dirección como principal
 */
export const marcarDireccionPrincipal = async (idUsuario: number, idDireccion: number) => {
  const response = await axiosInstance.post(
    `${API_BASE}/${idUsuario}/direcciones/${idDireccion}/marcar-principal/`
  );
  return response;
};
