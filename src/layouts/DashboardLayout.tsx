import { useState } from "react";
import Sidebar from "../components/common/sidebar";
import DashboardHeader from "../components/common/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 ml-0 lg:ml-64">
        {/* Header superior */}
        <DashboardHeader />

        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
