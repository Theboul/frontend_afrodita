import React, { useState } from "react";
import { MdPersonOutline, MdMenu, MdLogout, MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SidebarCliente from "./SidebarCliente";
import { useAuthStore } from "../../../stores/authStore";
import { useCarritoStore } from "../../stores/useCarritoStore";

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = "/assets/1.png",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  // 🛒 Estado global del carrito
  const productos = useCarritoStore((state) => state.productos);
  const totalItems = productos.reduce((acc, p) => acc + p.cantidad, 0);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const goToCarrito = () => {
    navigate("/carrito-cliente");
  };

  return (
    <>
      {/* Header principal */}
<header className="fixed top-0 left-0 w-full z-50 bg-[#F4AFCC]/100 backdrop-blur-md border-b border-pink-200 flex items-center justify-between px-4 sm:px-8 py-5 shadow-sm">
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

  {/* Botones carrito y sesión */}
  <div className="flex items-center gap-3">
    {/* Carrito */}
    <button
      onClick={goToCarrito}
      className="relative flex items-center gap-1 bg-white border border-[#F4AFCC] text-[#C25B8C] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#F4AFCC]/20 transition"
    >
      <MdShoppingCart size={18} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1.5">
          {totalItems}
        </span>
      )}
    </button>

    {/* Iniciar sesión / Cerrar sesión */}
    <button
      onClick={handleAuthAction}
      className="flex items-center gap-1 bg-white border border-[#F4AFCC] text-[#C25B8C] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#F4AFCC]/20 transition"
    >
      {isAuthenticated ? (
        <>
          <MdLogout size={18} />
          Cerrar sesión
        </>
      ) : (
        <>
          <MdPersonOutline size={18} />
          Iniciar sesión
        </>
      )}
    </button>
  </div>
</header>


      {/* Sidebar Cliente */}
    
    {sidebarOpen && (
          <div className="fixed inset-0 z-[9999] flex">
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setSidebarOpen(false)}
          ></div>

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
