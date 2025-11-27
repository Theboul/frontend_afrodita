import { create } from "zustand";
import { DevolucionesService } from "../services/devoluciones/devolucionesService";


export const useDevolucionesStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchMis: async () => {
    set({ loading: true });
    try {
      const res = await DevolucionesService.mis();
      set({ items: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTodas: async () => {
    set({ loading: true });
    try {
      const res = await DevolucionesService.todas();
      set({ items: res.data.results ?? res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  aprobar: async (id) => {
    try {
      await DevolucionesService.aprobar(id);
      get().fetchTodas();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  rechazar: async (id) => {
    try {
      await DevolucionesService.rechazar(id);
      get().fetchTodas();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
