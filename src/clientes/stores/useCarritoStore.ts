import { create } from "zustand";

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

interface CarritoState {
  productos: Producto[];
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (id: number) => void;
  vaciarCarrito: () => void;
}

export const useCarritoStore = create<CarritoState>((set) => ({
  productos: [],
  
  agregarProducto: (producto) =>
    set((state) => {
      const existe = state.productos.find(p => p.id === producto.id);
      if (existe) {
        return {
          productos: state.productos.map(p =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + producto.cantidad } : p
          )
        };
      }
      return { productos: [...state.productos, producto] };
    }),

  quitarProducto: (id) =>
    set((state) => ({
      productos: state.productos.filter(p => p.id !== id),
    })),

  vaciarCarrito: () => set({ productos: [] }),
}));
