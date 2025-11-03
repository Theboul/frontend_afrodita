import React from "react";
import { MdPersonOutline, MdMenu } from "react-icons/md";

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc = "/assets/1.png" }) => {
  return (
    <header className="w-full bg-[#F4AFCC]/100 backdrop-blur-md border-b border-pink-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        {/* Menú hamburguesa */}
        <button
          className="text-gray-700 hover:text-[#C25B8C] transition-colors p-1.5 sm:p-2 rounded-md hover:bg-[#FBE2EB] active:scale-95"
          aria-label="Abrir menú"
        >
          <MdMenu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Logo - centrado y responsivo */}
        <div className="flex items-center justify-center flex-1 sm:flex-initial">
          <img
            src={logoSrc}
            alt="Logo Afrodita"
            className="h-8 sm:h-10 lg:h-12 object-contain hover:scale-105 transition-transform"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="flex items-center gap-1 bg-white border border-[#F4AFCC] text-[#C25B8C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#F4AFCC]/20 transition active:scale-95 whitespace-nowrap"
          >
            <MdPersonOutline className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Iniciar sesión</span>
            <span className="xs:hidden">Entrar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;