import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import Footer from "../../components/common/Footer";
import Visitanos from "../../components/dashboard/Visitanos";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";
import EnviosTodoBolivia from "../../components/dashboard/EnviosBanner";
import { useNavigate } from "react-router-dom";

const DashboardCliente: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ✅ Optimización: Un solo IntersectionObserver para todas las secciones
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section-id");
          if (sectionId && entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(sectionId));
          }
        });
      },
      { threshold: 0.3 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Hook optimizado de animación por scroll
  const useScrollAnimation = (id: string) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = ref.current;
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }

      return () => {
        if (element && observerRef.current) {
          observerRef.current.unobserve(element);
        }
      };
    }, []);

    const isVisible = visibleSections.has(id);
    return { ref, isVisible };
  };

  // 🔹 Guarda la categoría seleccionada y redirige al catálogo
  function setCategoriaSeleccionada(categoria: string): void {
    localStorage.setItem("categoriaSeleccionada", categoria);
    navigate("/catalogo-cliente");
  }

  const banner = useScrollAnimation("banner");
  const search = useScrollAnimation("search");
  const filtros = useScrollAnimation("filtros");
  const panel = useScrollAnimation("panel");
  const visitanos = useScrollAnimation("visitanos");

  return (
    <div className="flex flex-col min-h-screen">
      <Header logoSrc="/assets/1.png" />

      <main className="flex-1 w-full">
        {/* Banner */}
        <div
          ref={banner.ref}
          data-section-id="banner"
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

        {/* SearchBar */}
        <div
          ref={search.ref}
          data-section-id="search"
          className={`transition-all duration-[1000ms] ease-out transform ${
            search.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          } w-full px-4 sm:px-6 lg:px-8 mt-10`}
        >
          {/*<SearchBar />*/}
        </div>

        {/* Filtro de búsquedas */}
        <div
          ref={filtros.ref}
          data-section-id="filtros"
          className={`transition-all duration-[1000ms] ease-out transform ${
            filtros.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          } w-full px-4 sm:px-6 lg:px-8 mt-8`}
        >
          <FiltrarBusquedas onFiltrar={setCategoriaSeleccionada} />
        </div>

        {/* Sección de contenido */}
        <section
          ref={panel.ref}
          data-section-id="panel"
          className={`transition-all duration-[1000ms] ease-out transform p-6 sm:p-8 md:p-12 ${
            panel.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[#C25B8C] text-center sm:text-left">
            LENTES HIPERREALISTAS
          </h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center sm:text-left">
            Transforma tu mirada con nuestros lentes de contacto estéticos y con
            graduación, diseñados para brindarte comodidad, seguridad y estilo
            único. Descubre más de 80 modelos exclusivos en colores naturales y
            fantasía, perfectos para cambiar tu look cuando quieras.
          </p>
        </section>

        <EnviosTodoBolivia />

        <div
          ref={visitanos.ref}
          data-section-id="visitanos"
          className={`transition-all duration-[1000ms] ease-out transform ${
            visitanos.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          } w-full px-4 sm:px-6 lg:px-8 mt-8`}
        >
          <Visitanos />
        </div>
      </main>

      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default DashboardCliente;
