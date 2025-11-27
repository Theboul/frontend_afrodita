import { useCallback, useState } from "react";
import {
  reportesService,
  type GenerarReportePayload,
  type ReporteGenerado,
  type ReporteTipo,
  type AccionBitacora,
  type UsuarioReporteResumen,
} from "../services/reportes/reportesService";

interface UseReportesState {
  tipos: ReporteTipo[];
  reporte: ReporteGenerado | null;
  loadingTipos: boolean;
  loadingReporte: boolean;
  error: string | null;
  accionesBitacora: AccionBitacora[];
  usuariosSugeridos: UsuarioReporteResumen[];
}

export const useReportes = () => {
  const [state, setState] = useState<UseReportesState>({
    tipos: [],
    reporte: null,
    loadingTipos: false,
    loadingReporte: false,
    error: null,
    accionesBitacora: [],
    usuariosSugeridos: [],
  });

  const loadTipos = useCallback(async () => {
    setState((prev) => ({ ...prev, loadingTipos: true, error: null }));
    try {
      const res = await reportesService.getTipos();
      const data = res.data;
      if (res.success && data && data.tipos) {
        setState((prev) => ({
          ...prev,
          tipos: data.tipos,
          loadingTipos: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loadingTipos: false,
          error: res.message || "No se pudieron cargar los tipos de reporte",
        }));
      }

      const accionesRes = await reportesService.getAccionesBitacora();
      if (accionesRes.success && accionesRes.data?.acciones) {
        setState((prev) => ({
          ...prev,
          accionesBitacora: accionesRes.data!.acciones,
          loadingTipos: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loadingTipos: false,
          error: res.message || "No se pudieron cargar los tipos de reporte",
        }));
      }
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loadingTipos: false,
        error:
          err?.message ?? "Error inesperado al cargar los tipos de reporte",
      }));
    }
  }, []);

  const generarReporte = useCallback(async (payload: GenerarReportePayload) => {
    setState((prev) => ({ ...prev, loadingReporte: true, error: null }));
    try {
      const res = await reportesService.generar(payload);
      if (res.success && res.data) {
        setState((prev) => ({
          ...prev,
          reporte: res.data ?? null,
          loadingReporte: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loadingReporte: false,
          error: res.message || "No se pudo generar el reporte",
        }));
      }
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loadingReporte: false,
        error: err?.message ?? "Error inesperado al generar el reporte",
      }));
    }
  }, []);

  const clearError = () =>
    setState((prev) => ({
      ...prev,
      error: null,
    }));

  const buscarUsuarios = useCallback(async (q: string) => {
    if (!q.trim()) {
      setState((prev) => ({ ...prev, usuariosSugeridos: [] }));
      return;
    }
    try {
      const data = await reportesService.buscarUsuarios(q);
      setState((prev) => ({ ...prev, usuariosSugeridos: data.results }));
    } catch {
      setState((prev) => ({ ...prev, usuariosSugeridos: [] }));
    }
  }, []);

  return {
    ...state,
    loadTipos,
    generarReporte,
    buscarUsuarios,
    clearError,
  };
};
