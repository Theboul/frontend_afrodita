// src/clientes/pages/productos/Contacto.tsx
import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Contacto: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header logoSrc="/assets/1.png" />

      {/* Contenido principal */}
      <main className="flex-1 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C25B8C] mb-6 sm:mb-8">
          Contáctanos
        </h1>

        <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-2 sm:px-0">
          Estamos aquí para ayudarte. Comunícate con nosotros a través de los siguientes medios:
        </p>

        <div className="space-y-4 text-gray-800 text-sm sm:text-base md:text-lg">
          <p>📍 <strong>Dirección:</strong> Calle Ejemplo 123, Ciudad, Bolivia</p>
          <p>📞 <strong>Teléfono:</strong> +591 700-00000</p>
          <p>✉️ <strong>Email:</strong> contacto@afrodita.com</p>
        </div>

        <div className="mt-8 sm:mt-10">
          <p className="text-gray-600 text-sm sm:text-base">
            También puedes encontrarnos en nuestras redes sociales:
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 text-[#C25B8C] text-2xl">
            <a href="#" aria-label="Facebook" className="hover:text-[#F4AFCC] transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#F4AFCC] transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-[#F4AFCC] transition">
              <FaTiktok />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default Contacto;
