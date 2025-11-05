import { create } from "zustand";
import CarritoService from "../services/CarritoService";

export interface ProductoCarrito {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: number;
  cantidad: number;
  stock?: number;
}

interface CarritoState {
  productos: ProductoCarrito[];
  total: number;
  error: string | null;
  cargarCarrito: () => Promise<void>;
  agregarProducto: (producto: ProductoCarrito) => Promise<void>;
  aumentarCantidad: (id: string) => Promise<void>;
  disminuirCantidad: (id: string) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  clearError: () => void;
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
  productos: [],
  total: 0,
  error: null,

  // ============================
  // CARGAR CARRITO
  // ============================
  cargarCarrito: async () => {
    try {
      const data = await CarritoService.obtener();
      const detalles = data.detalles || [];

      set({
        productos: detalles.map((d) => ({
          id: String(d.id_producto),
          nombre: d.nombre_producto,
          precio: Number(d.precio_unitario),
          cantidad: Number(d.cantidad),
        })),
        total: data.total_general || 0,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || "Error al cargar el carrito",
      });
    }
  },

  // ============================
  // AGREGAR PRODUCTO
  // ============================
  agregarProducto: async (producto: ProductoCarrito) => {
    try {
      await CarritoService.agregar(producto.id, producto.cantidad);
      await get().cargarCarrito();
      set({ error: null });
    } catch (err: any) {
      set({
        error: err.message || "Error al agregar producto",
      });
    }
  },

  // ============================
  // AUMENTAR CANTIDAD
  // ============================
  aumentarCantidad: async (id: string) => {
    const prod = get().productos.find((p) => p.id === id);
    if (!prod) return;

    try {
      await CarritoService.actualizar(id, prod.cantidad + 1);
      await get().cargarCarrito();
    } catch (err: any) {
      set({
        error: err.message || "Error al aumentar cantidad",
      });
    }
  },

  // ============================
  // DISMINUIR CANTIDAD
  // ============================
  disminuirCantidad: async (id: string) => {
    const prod = get().productos.find((p) => p.id === id);
    if (!prod) return;

    const nuevaCantidad = prod.cantidad - 1;
    try {
      await CarritoService.actualizar(id, nuevaCantidad);
      await get().cargarCarrito();
    } catch (err: any) {
      set({
        error: err.message || "Error al disminuir cantidad",
      });
    }
  },

  // ============================
  // ELIMINAR PRODUCTO (CANTIDAD = 0)
  // ============================
  eliminarProducto: async (id: string) => {
    try {
      await CarritoService.actualizar(id, 0);
      await get().cargarCarrito();
      set({ error: null });
    } catch (err: any) {
      set({
        error: err.message || "Error al eliminar producto",
      });
    }
  },

  // ============================
  // VACIAR CARRITO
  // ============================
  vaciarCarrito: async () => {
    try {
      await CarritoService.vaciar();
      set({ productos: [], total: 0, error: null });
    } catch (err: any) {
      set({
        error: err.message || "Error al vaciar carrito",
      });
    }
  },

  clearError: () => set({ error: null }),
}));