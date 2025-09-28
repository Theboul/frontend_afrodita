export interface ClienteRegistro {
  nombre_completo: string;
  nombre_usuario: string;
  password: string;
  correo: string;
  telefono?: string;
  sexo: "M" | "F" | "N";
  direccion: string;
}

const API_URL = "http://127.0.0.1:8000/api/clientes/registro/";

export async function registrarCliente(datos: ClienteRegistro) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error("Error en el registro");
  }

  return await response.json();
}