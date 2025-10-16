import { useState } from "react";
import Sidebar from "../components/common/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 ml-0 lg:ml-64 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
