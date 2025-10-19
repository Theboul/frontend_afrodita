import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-3 bg-[#F4AFCC] shadow-md">
      {/* Lado izquierdo */}
      <div>
        <h1 className="text-xl font-bold text-white">Afrodita Dashboard</h1>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm font-semibold text-white/90">
            {user.username} ({user.rol})
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-[#F4AFCC] bg-white rounded-lg shadow hover:bg-pink-50 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
