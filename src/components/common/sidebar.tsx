import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, ChevronDown, ChevronRight, X } from "lucide-react";
import { menuModules } from "../../config/menuConfig";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const toggle = (label: string) =>
    setActiveModule(activeModule === label ? null : label);

  return (
    <>
      {/* Fondo oscuro móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-45 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={`sidebar-container overflow-y-auto h-screen ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Encabezado */}
        <div className="sidebar-header relative flex flex-col">
           <div>
              <h1 className="text-xl text-black font-bold tracking-wide">🌸 Afrodita</h1>
              <h3 className="text-sm text-black/70 font-bold mt-1">Panel Administrativo</h3>
           </div>
          <button
            onClick={() => setOpen(false)}
            className="bg-[#C98BB9] hover:bg-[#B257C9] p-1 rounded-md transition lg:hidden absolute top-2 right-2 z-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          {menuModules.map(({ label, icon: Icon, items }) => (
            <div key={label}>
              <button onClick={() => toggle(label)} className="sidebar-button">
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{label}</span>
                </div>
                {activeModule === label ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              {activeModule === label && (
                <div className="ml-8 mt-1 space-y-1 animate-slide-down">
                  {items.map(({ label: subLabel, to }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `sidebar-subitem ${
                          isActive ? "sidebar-subitem-active" : ""
                        }`
                      }
                    >
                      {subLabel}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Pie */}
        <div className="sidebar-footer">© 2025 Afrodita</div>
      </aside>

      {/* Botón flotante móvil */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-800 transition z-40"
      >
        <Menu size={24} />
      </button>
    </>
  );
}
