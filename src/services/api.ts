import axios from "axios";

// Permite dejar VITE_API_URL en blanco para usar el proxy de Vite (/api → backend)
const base = (import.meta.env.VITE_API_URL);
const API = axios.create({
  baseURL: base !== undefined ? base : 'http://127.0.0.1:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  withCredentials: true,
});

export default API;
