import React, { useState } from "react";
import Header from "../src/components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import GestionarCategoria from "../src/pages/auth/GestionarCategoria";


const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <main style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s" }}>
        <GestionarCategoria />
      </main>

      <Footer />
    </div>
  );
};

export default App;