import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/carrito/";

export const obtener = async () => {
  const res = await axios.get(`${API_BASE}`, { withCredentials: true });
  return res.data;
};

export const agregar = async (id_producto: number, cantidad = 1) => {
  const res = await axios.post(
    `${API_BASE}agregar/`,
    { id_producto, cantidad },
    { withCredentials: true }
  );
  return res.data;
};

export const actualizar = async (id_producto: number, cantidad: number) => {
  const res = await axios.put(
    `${API_BASE}actualizar/`,
    { id_producto, cantidad },
    { withCredentials: true }
  );
  return res.data;
};

export const vaciar = async () => {
  const res = await axios.post(`${API_BASE}vaciar/`, {}, { withCredentials: true });
  return res.data;
};

const CarritoService = { obtener, agregar, actualizar, vaciar };
export default CarritoService;
