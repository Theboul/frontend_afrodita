import React from "react";
import { MdPersonOutline, MdMenu } from "react-icons/md";

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc = "../../../public/assets/1.png" }) => {
  return (
    <header className="w-full bg-[#F4AFCC]/100 backdrop-blur-md border-b border-pink-200 flex items-center justify-between px-4 sm:px-8 py-5 shadow-sm">
      {/* Menú hamburguesa */}
      <button
        className="text-gray-700 hover:text-[#C25B8C] transition-colors p-2 rounded-md hover:bg-[#FBE2EB]"
        aria-label="Abrir menú"
      >
        <MdMenu size={24} />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Logo Afrodita"
          className="h-10 object-contain hover:scale-105 transition-transform"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1 bg-white border border-[#F4AFCC] text-[#C25B8C] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#F4AFCC]/20 transition"
        >
          <MdPersonOutline size={18} />
          Iniciar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;