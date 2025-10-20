import { useState, useEffect, useCallback } from "react";
import { CategoriaService, type Categoria } from "../services/categorias/categoriaService";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** === Cargar categorías (por jerarquía) === */
  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CategoriaService.listar_arbol();
      setCategorias(res);
    } catch {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  /** === Crear === */
  const crear = async (data: Partial<Categoria>) => {
    await CategoriaService.crear(data);
    await cargarCategorias();
  };

  /** === Actualizar === */
  const actualizar = async (id: number, data: Partial<Categoria>) => {
    await CategoriaService.actualizar(id, data);
    await cargarCategorias();
  };

  /** === Eliminar === */
  const eliminar = async (id: number) => {
    await CategoriaService.eliminar(id);
    await cargarCategorias();
  };

  /** === Mover === */
  const mover = async (id: number, nuevo_padre: number | null, motivo: string) => {
    await CategoriaService.mover(id, nuevo_padre, motivo);
    await cargarCategorias();
  };

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  return {
    categorias,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    mover,
    refrescar: cargarCategorias,
  };
}
