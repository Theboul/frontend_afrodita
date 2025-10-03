const BASE_URL = "http://127.0.0.1:8000/api/clientes/registro/";

export interface ClienteRegistro {
  nombre_completo: string;
  nombre_usuario: string;
  password: string;
  correo: string;
  telefono?: string;
  sexo: "M" | "F" | "N";
  direccion: string;
}

export async function registrarStep1(datos: {
  nombre_usuario: string;
  correo: string;
  password: string;
  confirm_password: string;
}) {
  const response = await fetch(BASE_URL + "step1/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    throw new Error("Error en el paso 1");
  }
  return await response.json();
}

export async function registrarStep2(datos: ClienteRegistro) {
  const response = await fetch(BASE_URL + "step2/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    throw new Error("Error en el paso 2");
  }
  return await response.json();
}