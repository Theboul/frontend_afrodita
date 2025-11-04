import { create } from "zustand";
import CarritoService from "../services/CarritoService";

export interface ProductoCarrito {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

interface CarritoState {
  productos: ProductoCarrito[];
  cargarCarrito: () => Promise<void>;
  agregarProducto: (producto: ProductoCarrito) => Promise<void>;
  aumentarCantidad: (id: number) => Promise<void>;
  disminuirCantidad: (id: number) => Promise<void>;
  eliminarProducto: (id: number) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
  productos: [],

  cargarCarrito: async () => {
    const data = await CarritoService.obtener();
    set({
      productos: data.detalles.map((d: any) => ({
        id: Number(d.id_producto.id_producto),
        nombre: d.id_producto.nombre,
        descripcion: d.id_producto.descripcion,
        imagen: d.id_producto.imagen_principal?.url || "/assets/default.jpg",
        precio: Number(d.id_producto.precio),
        cantidad: d.cantidad,
      })),
    });
  },

  agregarProducto: async (producto: ProductoCarrito) => {
    await CarritoService.agregar(producto.id);
    const productos = get().productos;
    const existe = productos.find((p) => p.id === producto.id);
    if (existe) {
      set({
        productos: productos.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        ),
      });
    } else {
      set({ productos: [...productos, { ...producto, cantidad: 1 }] });
    }
  },

  aumentarCantidad: async (id: number) => {
    const productos = get().productos;
    const prod = productos.find((p) => p.id === id);
    if (!prod) return;
    await CarritoService.actualizar(id, prod.cantidad + 1);
    set({
      productos: productos.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      ),
    });
  },

  disminuirCantidad: async (id: number) => {
    const productos = get().productos;
    const prod = productos.find((p) => p.id === id);
    if (!prod) return;
    const nuevaCantidad = prod.cantidad - 1;
    await CarritoService.actualizar(id, nuevaCantidad);
    if (nuevaCantidad <= 0) {
      set({ productos: productos.filter((p) => p.id !== id) });
    } else {
      set({
        productos: productos.map((p) =>
          p.id === id ? { ...p, cantidad: nuevaCantidad } : p
        ),
      });
    }
  },

  eliminarProducto: async (id: number) => {
    await CarritoService.actualizar(id, 0);
    set({ productos: get().productos.filter((p) => p.id !== id) });
  },

  vaciarCarrito: async () => {
    const productos = get().productos;
    for (const p of productos) {
      await CarritoService.actualizar(p.id, 0);
    }
    set({ productos: [] });
  },
}));
