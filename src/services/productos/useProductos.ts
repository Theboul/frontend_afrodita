import { useEffect, useState } from "react";
import { ProductoService } from "./ProductoService";

export interface ProductoConImagen {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado_producto: string;
  categoria_nombre: string;
  imagen_principal_url?: string;
}

export const useProductos = (searchText?: string, categoria?: string) => {
  const [productos, setProductos] = useState<ProductoConImagen[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchText) params.search = searchText;
      if (categoria) params.categoria = categoria;

      const response = await ProductoService.listarConImagen(params);
      setProductos(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [searchText, categoria]);

  return { productos, loading, error, refetch: fetchProductos };
};
