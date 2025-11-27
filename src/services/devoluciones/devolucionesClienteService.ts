import api from "../api";

export const solicitarDevolucion = async (data: any) => {
  const res = await api.post("/devoluciones/crear/", data);
  return res.data;
};

export const obtenerMisDevoluciones = async () => {
  const res = await api.get("/devoluciones/mis/");
  return res.data;
};
