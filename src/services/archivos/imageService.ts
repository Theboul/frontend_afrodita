import { axiosInstance } from "../axiosConfig";

export interface ImagenProducto {
  id_imagen: number;
  url: string;
  public_id: string;
  formato: string;
  es_principal: boolean;
  orden: number;
  estado_imagen: string;
  subido_por?: {
    id: number;
    nombre: string;
  };
  fecha_subida: string;
  fecha_actualizacion: string;
  metadata?: {
    thumbnail: string;
    medium: string;
  };
}

export const imageService = {
  async getByProduct(productId: string): Promise<ImagenProducto[]> {
    const res = await axiosInstance.get(`/api/imagenes/?producto=${productId}`);
    const data = res.data;
    return Array.isArray(data) ? data : data.results || [];
  },

  async upload(productId: string, file: File, esPrincipal = false, orden = 1) {
    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("es_principal", String(esPrincipal));
    formData.append("orden", String(orden));

    const res = await axiosInstance.post(
      `/api/imagenes/productos/${productId}/subir/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/api/imagenes/${id}/eliminar/`);
  },

  async restore(id: number): Promise<void> {
    await axiosInstance.post(`/api/imagenes/${id}/restaurar/`);
  },

  async markAsMain(id: number): Promise<void> {
    await axiosInstance.post(`/api/imagenes/${id}/marcar_principal/`);
  },

  async reorder(productId: string, orden: any[]): Promise<void> {
    await axiosInstance.post(`/api/imagenes/productos/${productId}/reordenar/`, { orden });
  },
};
