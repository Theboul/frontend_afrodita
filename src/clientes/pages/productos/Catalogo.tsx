import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";
import SearchBar from "../../components/common/Search";
import { ProductoService } from "../../../services/productos/ProductoService";
import type { Producto } from "../../../services/productos/ProductoService";
import { useCarritoStore } from "../../stores/useCarritoStore";

const CatalogoCliente: React.FC = () => {
  const { agregarProducto } = useCarritoStore();

  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);

  // Hook animación scroll
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

    const isVisible = visibleSections.includes(id);
    return { ref, isVisible };
  };

  const search = useScrollAnimation("search");
  const filtros = useScrollAnimation("filtros");

  useEffect(() => {
    localStorage.removeItem("categoriaSeleccionada");
    setCategoriaSeleccionada(null);
    setPage(1);
    fetchProductos({ page: 1 }, true);
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("categoriaSeleccionada");
    };
  }, []);

  const fetchProductos = async (params: any = {}, reset: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ProductoService.listarConImagen(params);
      let productosData: Producto[] = response.data || response.results || [];

      productosData = productosData.filter((p) => p.estado_producto === "ACTIVO");

      if (reset) {
        setProductos(productosData);
      } else {
        setProductos((prev) => [...prev, ...productosData]);
      }

      setNextPage(response.next || null);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const setNuevaCategoriaSeleccionada = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    localStorage.setItem("categoriaSeleccionada", categoria);
    setPage(1);
    fetchProductos({ page: 1, categoria }, true);
  };

  const cargarMas = () => {
    if (!nextPage) return;

    const params: any = { page: page + 1 };
    if (categoriaSeleccionada) params.categoria = categoriaSeleccionada;
    if (searchTerm) params.search = searchTerm;

    fetchProductos(params, false);
    setPage(page + 1);
  };

  const ProductoCard = ({ producto }: any) => (
    <div className="p-4 bg-white shadow-md rounded-xl flex flex-col items-center hover:scale-105 transform transition">
      <div className="w-full aspect-square rounded-lg overflow-hidden">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold mt-2 text-center">{producto.nombre}</h3>
      <p className="text-gray-600 text-sm text-center mt-1 line-clamp-2">{producto.descripcion}</p>
      <p className="text-pink-600 font-semibold mt-1">Bs {producto.precio}</p>
      <button
        onClick={() => agregarProducto(producto)}
        className="mt-2 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
      >
        Agregar al carrito
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header logoSrc="/assets/1.png" />

      <main className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8 mt-8">
        {/* Search */}
        <div
          ref={search.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            search.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } mb-6 sm:mb-8`}
        >
          <SearchBar onSearch={setSearchTerm} value={searchTerm} />
        </div>

        {/* Filtros */}
        <div
          ref={filtros.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            filtros.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } mb-6 sm:mb-8`}
        >
          <FiltrarBusquedas onFiltrar={setNuevaCategoriaSeleccionada} />
        </div>

        {/* Productos */}
        <section className="p-6 text-center text-gray-700">
          {categoriaSeleccionada ? (
            <p>
              🛍️ Mostrando productos de la categoría:{" "}
              <strong className="text-[#C25B8C]">{categoriaSeleccionada}</strong>
            </p>
          ) : (
            <p>Mostrando todos los productos</p>
          )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {productos.map((prod) => (
              <ProductoCard
                key={prod.id_producto}
                producto={{
                  id: Number(prod.id_producto),
                  nombre: prod.nombre,
                  descripcion: prod.descripcion,
                  imagen: prod.imagen_principal?.url || "/assets/default.jpg",
                  precio: prod.precio,
                  cantidad: 1,
                }}
              />
            ))}
          </div>

          {loading && <p className="mt-4 text-gray-500">Cargando productos...</p>}

          {/* Ver más */}
          {!loading && nextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={cargarMas}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-full sm:w-auto transition"
              >
                Ver más
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default CatalogoCliente;
