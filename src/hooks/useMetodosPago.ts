import { useCallback, useEffect, useState } from "react";
import { paymentMethodService, type MetodoPago } from "../services/pagos/paymentMethodService";

export type TriState = "all" | "true" | "false";

export interface FiltrosMetodosPago {
  search: string;
  tipo: string;
  categoria: string;
  requiere_pasarela: TriState;
  activo: TriState;
}

const triToBool = (v: TriState): boolean | undefined =>
  v === "all" ? undefined : v === "true";

export function useMetodosPago() {
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosMetodosPago>({
    search: "",
    tipo: "",
    categoria: "",
    requiere_pasarela: "all",
    activo: "all",
  });

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        search: filtros.search || undefined,
        tipo: filtros.tipo || undefined,
        categoria: filtros.categoria || undefined,
        requiere_pasarela: triToBool(filtros.requiere_pasarela),
        activo: triToBool(filtros.activo),
      };

      const res = await paymentMethodService.list(params);
      
      // El backend devuelve paginación: { success, message, data: { count, results: [...] } }
      // Los datos están en res.data.results
      let data: any[] = [];
      
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray((res as any).data)) {
        data = (res as any).data;
      } else if ((res as any).data?.results && Array.isArray((res as any).data.results)) {
        data = (res as any).data.results;
      } else if ((res as any).results && Array.isArray((res as any).results)) {
        data = (res as any).results;
      }
      
      // Normalizar los datos: el backend usa id_metodo_pago, pero la interfaz espera id
      const metodosMapeados = data.map((m: any) => ({
        ...m,
        id: m.id_metodo_pago || m.id
      }));
      
      setMetodos(metodosMapeados);
    } catch (e) {
      setError("Error al cargar métodos de pago");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (data: Partial<MetodoPago>) => {
    await paymentMethodService.create(data);
    await cargar();
  };

  const actualizar = async (id: number, data: Partial<MetodoPago>) => {
    await paymentMethodService.update(id, data);
    await cargar();
  };

  const activar = async (id: number) => {
    await paymentMethodService.activate(id);
    await cargar();
  };

  const desactivar = async (id: number) => {
    await paymentMethodService.deactivate(id);
    await cargar();
  };

  return {
    metodos,
    loading,
    error,
    filtros,
    setFiltros,
    cargar,
    crear,
    actualizar,
    activar,
    desactivar,
  };
}