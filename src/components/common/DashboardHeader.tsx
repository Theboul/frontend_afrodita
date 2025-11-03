import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";

interface HeaderProps {
  logoSrc?: string;
}

const DashboardHeader: React.FC<HeaderProps> = ({ logoSrc = "/assets/1.png" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-[#F4AFCC] shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between">
          {/* Lado izquierdo - Logo y título */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-initial">
            <img
              src={logoSrc}
              alt="Logo Afrodita"
              className="h-8 sm:h-9 lg:h-10 object-contain hover:scale-105 transition-transform"
            />
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white whitespace-nowrap">
              <span className="hidden sm:inline">Afrodita Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>

          {/* Lado derecho - Desktop */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            {user && (
              <div className="flex flex-col items-end">
                <span className="text-xs lg:text-sm font-semibold text-white">
                  {user.username}
                </span>
                <span className="text-xs text-white/80">
                  {user.rol}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold text-[#F4AFCC] bg-white rounded-lg shadow hover:bg-pink-50 transition active:scale-95"
            >
              <MdLogout className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden md:inline">Cerrar sesión</span>
              <span className="md:hidden">Salir</span>
            </button>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white hover:bg-white/10 rounded-lg transition active:scale-95"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <MdClose className="w-6 h-6" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-white/20 animate-fadeIn">
            {user && (
              <div className="mb-3 px-2">
                <p className="text-sm font-semibold text-white">
                  {user.username}
                </p>
                <p className="text-xs text-white/80">
                  {user.rol}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#F4AFCC] bg-white rounded-lg shadow hover:bg-pink-50 transition active:scale-95"
            >
              <MdLogout className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
