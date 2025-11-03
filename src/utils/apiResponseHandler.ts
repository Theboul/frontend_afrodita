/**
 * Utilidad para manejar respuestas estandarizadas de la API
 * 
 * El backend Django devuelve respuestas en este formato:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   errors?: any
 * }
 */

import type { ApiResponse } from '../services/axiosConfig';

/**
 * Extrae los datos de una respuesta exitosa del backend
 * @param response - Respuesta transformada por el interceptor
 * @param dataKey - Clave opcional dentro de data (ej: 'perfil', 'estadisticas')
 * @throws Error si la respuesta no es exitosa
 */
export function extractData<T>(
  response: ApiResponse<any>,
  dataKey?: string
): T {
  // Verificar si la respuesta es exitosa
  if (!response.success) {
    throw new Error(response.message || 'Error en la petición');
  }

  // Si no hay data, lanzar error
  if (!response.data) {
    throw new Error(response.message || 'No se recibieron datos');
  }

  // Si se especifica una clave, intentar accederla
  if (dataKey && response.data[dataKey]) {
    return response.data[dataKey] as T;
  }

  // Retornar data directamente
  return response.data as T;
}

/**
 * Valida que una respuesta sea exitosa
 * @param response - Respuesta transformada por el interceptor
 * @throws Error si la respuesta no es exitosa
 */
export function validateSuccess(response: ApiResponse): void {
  if (!response.success) {
    throw new Error(response.message || 'Error en la petición');
  }
}

/**
 * Extrae errores de una respuesta fallida
 * @param response - Respuesta transformada por el interceptor
 */
export function extractErrors(response: ApiResponse): any {
  return response.errors || {};
}
