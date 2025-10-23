import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import Footer from "../../components/common/Footer";
import Visitanos from "../../components/dashboard/Visitanos";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";
import { ProductoService, type Producto } from "../../../services/productos/ProductoService";



const DashboardCliente: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // función auxiliar para observar elementos y activar animaciones
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

  function setCategoriaSeleccionada(categoria: string): void {
    console.log("Filtrando por:", categoria);
  }

  // refs para animaciones
  const banner = useScrollAnimation("banner");
  const filtros = useScrollAnimation("filtros");
  const panel = useScrollAnimation("panel");
  const visitanos = useScrollAnimation("visitanos");

  // ✅ Listar productos y mostrar en consola
  useEffect(() => {
    ProductoService.listar()
      .then((response) => {
        console.log("✅ Productos obtenidos desde el backend:", response.data);
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("❌ Error al listar productos:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header logoSrc="/assets/1.png" />

      {/* Contenido principal */}
      <main className="flex-1">
        {/* Banner */}
        <div
          ref={banner.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            banner.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Banner
            title="Bienvenido a Afrodita"
            subtitle="Explora nuestros productos exclusivos"
            imageSrc="/assets/Banner.png"
            ctaText="Ver Productos"
            ctaLink="/productos"
          />
        </div>

        {/* Filtro de búsquedas */}
        <div
          ref={filtros.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            filtros.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <FiltrarBusquedas onFiltrar={setCategoriaSeleccionada} />
        </div>

        {/* Sección de contenido */}
        <section
          ref={panel.ref}
          className={`p-6 transition-all duration-[1000ms] ease-out transform ${
            panel.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 text-[#C25B8C]">
            Tu Panel de Control
          </h2>
          <p className="text-gray-700">
            Esta parte va ser modificada, es solo para mostrar un contenido de ejemplo.
          </p>
        </section>

        {/* Visítanos */}
        <div
          ref={visitanos.ref}
          className={`transition-all duration-[1000ms] ease-out transform ${
            visitanos.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Visitanos />
        </div>
      </main>

      {/* Footer */}
      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default DashboardCliente;
