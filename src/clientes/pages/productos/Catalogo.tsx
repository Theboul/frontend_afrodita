import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";
import SearchBar from "../../components/common/Search";
import { ProductoService } from "../../../services/productos/ProductoService";
import type { Producto } from "../../../services/productos/ProductoService";

const CatalogoCliente: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);

  // Hook de animación por scroll
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

  // 🔹 Limpia localStorage al montar la página
  useEffect(() => {
    localStorage.removeItem("categoriaSeleccionada");
    setCategoriaSeleccionada(null);
    setPage(1);
    fetchProductos({ page: 1 }, true); // fetch inicial
  }, []);

  // 🔹 Limpia localStorage al salir de la página
  useEffect(() => {
    return () => {
      localStorage.removeItem("categoriaSeleccionada");
    };
  }, []);

  // 🔹 Función para cargar productos desde backend
  const fetchProductos = async (params: any = {}, reset: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ProductoService.listarConImagen(params);
      let productosData: Producto[] = response.data || response.results || [];

      // Solo mostrar productos ACTIVO
      productosData = productosData.filter((p) => p.estado_producto === "ACTIVO");

      if (reset) {
        setProductos(productosData);
      } else {
        setProductos((prev) => [...prev, ...productosData]);
      }

      setNextPage(response.next || null);
      console.log("🛒 Productos cargados:", productosData);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambia categoría desde filtro
  const setNuevaCategoriaSeleccionada = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    localStorage.setItem("categoriaSeleccionada", categoria);
    setPage(1);
    fetchProductos({ page: 1, categoria }, true); // reset productos
  };

  // 🔹 Cargar siguiente página (ver más)
  const cargarMas = () => {
    if (!nextPage) return;

    const params: any = { page: page + 1 };
    if (categoriaSeleccionada) params.categoria = categoriaSeleccionada;
    if (searchTerm) params.search = searchTerm;

    fetchProductos(params, false); // agregar productos debajo
    setPage(page + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header logoSrc="/assets/1.png" />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 mt-10">
        {/* SearchBar */}
        <div
          ref={search.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            search.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } mb-8`}
        >
          <SearchBar onSearch={setSearchTerm} value={searchTerm} />
        </div>

        {/* Filtro */}
        <div
          ref={filtros.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            filtros.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {productos.map((prod) => {
              // Obtener la imagen principal
              const imagenPrincipal = prod.imagen_principal?.es_principal ? prod.imagen_principal.url : undefined;
              return (
                <div key={prod.id_producto} className="border p-4 rounded shadow flex flex-col items-center">
                  {imagenPrincipal && (
                    <img
                      src={imagenPrincipal}
                      alt={prod.nombre}
                      className="w-40 h-40 object-cover mb-2 rounded"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{prod.nombre}</h3>
                  <p className="text-gray-600">{prod.descripcion}</p>
                  <p className="font-bold mt-1">Precio: ${prod.precio}</p>
                  <p className="text-sm mt-1">Stock: {prod.stock}</p>
                </div>
              );
            })}
          </div>

          {/* Loader */}
          {loading && (
            <p className="mt-4 text-gray-500">Cargando productos...</p>
          )}

          {/* Ver más */}
          {!loading && nextPage && (
            <button
              onClick={cargarMas}
              className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Ver más
            </button>
          )}
        </section>
      </main>

      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default CatalogoCliente;
