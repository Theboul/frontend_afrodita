import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FiltrarBusquedas from "../../components/dashboard/FiltrarBusquedas";


const DashboardCliente: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

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
  const filtros = useScrollAnimation("filtros");
 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header logoSrc="/assets/1.png" />

      
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

        {/* Panel de productos */}
        
      

      {/* Footer */}
      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default DashboardCliente;
