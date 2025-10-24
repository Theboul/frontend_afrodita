import React, { useState } from "react";
import { MdPersonOutline, MdMenu } from "react-icons/md";
import SidebarCliente from "./SidebarCliente";

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = "../../../../public/assets/1.png",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 Control del sidebar

  return (
    <>
      {/* Header principal */}
      <header className="w-full bg-[#F4AFCC]/100 backdrop-blur-md border-b border-pink-200 flex items-center justify-between px-4 sm:px-8 py-5 shadow-sm">
        {/* Menú hamburguesa */}
        <button
          onClick={() => setSidebarOpen(true)}
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

        {/* Botón de iniciar sesión */}
       <div className="flex items-center gap-3">
         <a
           href="/login" 
           className="flex items-center gap-1 bg-white border border-[#F4AFCC] text-[#C25B8C] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#F4AFCC]/20 transition"
           >
           <MdPersonOutline size={18} />
            Iniciar sesión
          </a>
        </div>
      </header>

      {/* Sidebar Cliente fuera del header */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro (overlay) */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setSidebarOpen(false)}
          > </div>

          {/* Sidebar ocupando toda la pantalla */}
          <div
            className={`relative z-50 bg-pink w-full h-full shadow-none p-6 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              border: "none",
              boxShadow: "none",
            }}
          >
            <SidebarCliente
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
