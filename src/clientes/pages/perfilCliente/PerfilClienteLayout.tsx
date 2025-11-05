import { NavLink, Outlet } from "react-router-dom";
import ModuleLayout from "../../../layouts/ModuleLayout";

export default function PerfilClienteLayout() {
  return (
    <ModuleLayout title="Mi Perfil">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-4">
          <nav className="space-y-2">
            <NavLink
              to="/perfil-cliente/info"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              👤 Información Personal
            </NavLink>
            <NavLink
              to="/perfil-cliente/compras"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              🛍️ Mis Compras
            </NavLink>
            <NavLink
              to="/perfil-cliente/direcciones"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              🏠 Mis Direcciones
            </NavLink>
            <NavLink
              to="/perfil-cliente/soporte"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              💬 Mis Tickets
            </NavLink>
          </nav>
        </aside>

        {/* Contenido dinámico */}
        <section className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Outlet />
        </section>
      </div>
    </ModuleLayout>
  );
}
