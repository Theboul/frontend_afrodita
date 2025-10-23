import { X } from "lucide-react";
import { menuItems } from "../config/menuconfig";

interface SidebarClienteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarCliente({ isOpen, onClose }: SidebarClienteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo transparente */}
      <div
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative bg-pink-100 w-64 h-full p-6 shadow-lg flex flex-col gap-4">
        {/* Botón de cerrar */}
        <button
          className="self-end text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Menú */}
        <nav className="flex flex-col gap-3 mt-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href} // o usar <Link to={item.href}> si usas React Router
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
