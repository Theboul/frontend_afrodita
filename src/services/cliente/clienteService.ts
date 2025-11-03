const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { axiosInstance, type ApiResponse } from "../../services/axiosConfig";

export interface ClienteRegistro {
  nombre_completo: string;
  nombre_usuario: string;
  password: string;
  correo: string;
  telefono?: string;
  sexo: "M" | "F" | "N";
}

// Paso 1 — Validación de credenciales
export async function registrarStep1(datos: {
  nombre_usuario: string;
  correo: string;
  password: string;
  confirmar_password: string;
}) {
  // 🔹 Convertimos las claves antes de enviar
  const payload = {
    nombre_usuario: datos.nombre_usuario,
    correo: datos.correo,
    contraseña: datos.password, // backend espera "contraseña"
    confirmar_contraseña: datos.confirmar_password,
  };

  const response = await fetch(`${API_URL}/api/usuarios/register/cliente/step1/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en el paso 1");
  return data;
}

// Paso 2 — Creación definitiva del cliente
export async function registrarStep2(datos: {
  nombre_usuario: string;
  correo: string;
  password: string;
  nombre_completo: string;
  telefono?: string;
  sexo: "M" | "F" | "N";
}) {
  const payload = {
    nombre_usuario: datos.nombre_usuario,
    correo: datos.correo,
    contraseña: datos.password, // backend espera "contraseña"
    nombre_completo: datos.nombre_completo,
    telefono: datos.telefono,
    sexo: datos.sexo,
  };

  const response = await fetch(`${API_URL}/api/usuarios/register/cliente/step2/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en el paso 2");
  return data;
}

export interface ClientePerfil {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono?: string;
  direccion_principal?: string;
  fecha_registro: string;
  estado_usuario: string;
  sexo?: string;
}

export const clienteService = {
  async obtenerPerfil(): Promise<ApiResponse<ClientePerfil>> {
    return axiosInstance.get("/api/usuarios/cliente/perfil/");
  },

  async actualizarPerfil(data: Partial<ClientePerfil>): Promise<ApiResponse<ClientePerfil>> {
    return axiosInstance.patch("/api/usuarios/cliente/perfil/", data);
  },
};
