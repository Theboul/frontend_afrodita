const API_URL = "http://localhost:8000/api/"; // Cambia esto por la URL real de tu API

/**
 * Obtiene los últimos 50 registros de la bitácora del sistema.
 * @returns {Promise<Array>} Lista de registros
 */
export async function getBitacoraLogs() {
  try {
    const response = await fetch(`${API_URL}/bitacora/ultimos-movimientos/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // si usas JWT
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron obtener los registros.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener bitácora:", error);
    throw error;
  }
}