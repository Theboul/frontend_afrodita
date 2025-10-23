import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  withCredentials: true, // ✅ IMPORTANTE: Permite enviar/recibir cookies
});

export default API;
