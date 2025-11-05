import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0..0.1:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  withCredentials: true,
});

export default API;
