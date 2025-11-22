import { axiosInstance } from "../axiosConfig";

function extractResponse(res: any) {
  if (!res) return null;

  // Caso 1 → ApiResponse estándar
  if ("success" in res && "data" in res) {
    return res.data;
  }

  // Caso 2 → Axios retornó data directamente
  return res;
}

export const ventasService = {
  // 1 Listar métodos de pago (funciona con tu backend)
  listarMetodosPago: () => {
    return axiosInstance.get("/api/ventas/metodos-pago/");
  },

  // 2 Buscar clientes por nombre, correo o teléfono (requiere endpoint)
  buscarClientes: async (search: string) => {
    const res = await axiosInstance.get("/api/usuarios/buscar/", {
      params: { search }
    });

    return extractResponse(res);
  },

  // 3 Buscar productos (usa tu actual /api/productos/)
  buscarProductos: (search: string) => {
    return axiosInstance.get("/api/productos/", {
      params: { search }
    });
  },

  // 4 Registrar venta presencial
  registrarPresencial: (data: any) => {
    return axiosInstance.post("/api/ventas/presencial/", data);
  },

  // 5 Listar ventas
  listarVentas: () => {
    return axiosInstance.get("/api/ventas/");
  },

  // 6 Anular venta
  anularVenta: (id_venta: number) => {
    return axiosInstance.post(`/api/ventas/${id_venta}/anular/`);
  },
  
  obtenerVenta: (id_venta: number) => {
    return axiosInstance.get(`/api/ventas/${id_venta}/`)
      .then(res => {
        console.log("RESPUESTA SERVIDOR (VENTA):", res);

        // Si viene como ApiResponse estandarizado
        if (res && typeof res === "object" && "data" in res) {
          return res.data;
        }

        // Si viene en formato plano (caso ventas)
        return res;
      });
  },

  confirmarPago: (id_venta: number) => {
    return axiosInstance.post(`/api/ventas/${id_venta}/confirmar/`);
  },
};
