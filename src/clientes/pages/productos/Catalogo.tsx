// pages/producto/catalogo.tsx
import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";
import { catalogoService } from "../../../services/catalogo/catalogoService";

interface Categoria {
  id_categoria: number;
  nombre: string;
}

interface Producto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: string;
  color?: string;
  imagen_principal?: { url: string };
}

const DashboardCliente: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  // === Animación de scroll ===
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const useScrollAnimation = (id: string) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) =>
                prev.includes(id) ? prev : [...prev, id]
              );
            }
          });
        },
        { threshold: 0.3 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, [id]);
    return { ref, isVisible: visibleSections.includes(id) };
  };

  const filtros = useScrollAnimation("filtros");

  // === Cargar filtros y productos iniciales ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const filtros = await catalogoService.obtenerFiltros();
        setCategorias(filtros.categorias);
        const lista = await catalogoService.buscarProductos({});
        setProductos(lista.resultados);
      } catch (err) {
        console.error("Error al cargar catálogo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === Filtro de categoría ===
  const setCategoriaSeleccionada = async (categoriaId: number) => {
    console.log("Filtrando por:", categoriaId);
    setLoading(true);
    const res = await catalogoService.buscarProductos({ categoria: categoriaId });
    setProductos(res.resultados);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header logoSrc="/assets/1.png" />

      <div
        ref={filtros.ref}
        className={`transition-all duration-[1000ms] ease-out transform ${
          filtros.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <FiltrarBusquedas
          categorias={categorias}
          onFiltrar={setCategoriaSeleccionada}
        />
      </div>

      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {loading ? (
          <p className="text-center text-gray-600 col-span-full">Cargando productos...</p>
        ) : productos.length > 0 ? (
          productos.map((p) => (
            <div
              key={p.id_producto}
              className="bg-white rounded-xl shadow hover:shadow-md p-4 transition"
            >
              <img
                src={p.imagen_principal?.url || "/assets/no-image.png"}
                alt={p.nombre}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="font-semibold text-lg text-gray-800">{p.nombre}</h2>
              <p className="text-gray-500 text-sm">{p.descripcion}</p>
              <p className="text-[#C25B8C] font-bold mt-2">{p.precio} Bs</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No hay productos disponibles.
          </p>
        )}
      </main>

      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default DashboardCliente;
