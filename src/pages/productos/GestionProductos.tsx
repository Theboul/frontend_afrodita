import { useEffect, useState } from "react";
import { axiosInstance } from "../../services/axiosConfig";
import { type Producto, type Categoria, type Configuracion } from "../../services/productos/ProductoService";
import ProductoForm from "../../components/productos/ProductoForm";

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
  const [productoActual, setProductoActual] = useState<Partial<Producto>>({
    id_producto: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    estado_producto: "ACTIVO",
    id_categoria: "",
    id_configuracion: "",
  });

  // Cargas iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      await Promise.all([
        cargarProductos(),
        cargarCategorias(),
        cargarConfiguraciones()
      ]);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axiosInstance.get("/api/productos/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await axiosInstance.get("/api/categorias/listar_arbol/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const cargarConfiguraciones = async () => {
    try {
      const res = await axiosInstance.get("/api/productos/configuraciones/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setConfiguraciones(data);
    } catch (error) {
      console.error("Error cargando configuraciones:", error);
    }
  };

  const handleGuardarProducto = async (productoData: Partial<Producto>) => {
    try {
      if (productoData.id_producto) {
        await axiosInstance.put(`/api/productos/${productoData.id_producto}/`, productoData);
      } else {
        await axiosInstance.post("/api/productos/", productoData);
      }
      
      await cargarProductos();
      alert("Producto guardado correctamente.");
      setProductoActual({
        id_producto: "",
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        estado_producto: "ACTIVO",
        id_categoria: "",
        id_configuracion: "",
      });
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  const handleEliminarProducto = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axiosInstance.delete(`/api/productos/${id}/`);
      setProductos(prev => prev.filter(p => p.id_producto !== id));
      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="w-full min-h-[150vh] bg-[#FDF2F6] p-6">
      <div className="w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-pink-600 text-center">
          Gestión de Productos
        </h1>

        <ProductoForm
          producto={productoActual}
          categorias={categorias}
          configuraciones={configuraciones}
          onGuardar={handleGuardarProducto}
          onEliminar={handleEliminarProducto}
          onCambioProducto={setProductoActual}
          onImagenesSubidas={cargarProductos}
        />
      </div>
    </div>
  );
}