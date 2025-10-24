import { X } from "lucide-react";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CallIcon from "@mui/icons-material/Call";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface SidebarClienteProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Inicio", href: "/dashboard-cliente", icon: <HomeIcon className="text-pink-500" /> },
  { label: "Productos", href: "/catalogo-cliente", icon: <ShoppingBagIcon className="text-pink-500" /> },
  { label: "Contacto", href: "/contacto-cliente", icon: <CallIcon className="text-pink-500" /> },
  { label: "Preguntas Frecuentes", href: "preguntas-cliente", icon: <HelpOutlineIcon className="text-pink-500" /> },
];

export default function SidebarCliente({ isOpen, onClose }: SidebarClienteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo translúcido */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative bg-pink-100 w-64 sm:w-72 h-full p-6 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0 animate-slideIn rounded-r-2xl">
        {/* Botón de cerrar */}
        <button
          className="self-end text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Menú */}
        <nav className="flex flex-col gap-4 mt-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 text-gray-800 hover:text-pink-600 text-lg font-medium transition-colors"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
