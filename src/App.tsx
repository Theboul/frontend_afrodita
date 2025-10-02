import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registro from "./pages/auth/RegistroCliente";


import GestionUsuarios from "./pages/auth/GestionUsuarios";
import GestionRoles from "./pages/auth/GestionRoles";
import GestionProductos from "./pages/auth/GestionProductos";
import GestionCategorias from "./pages/auth/GestionCategorias";
import GestionArchivos from "./pages/auth/GestionArchivos";

import './styles/globals.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige "/" a "/registro" */}
        <Route path="/" element={<Navigate to="/registro" />} />

        {/* 🔑 RUTAS DE AUTENTICACIÓN */}
        <Route path="/registro" element={<Registro />} />

        {/* 👥 RUTAS DE GESTIÓN */}
        <Route path="/usuarios" element={<GestionUsuarios />} />
        <Route path="/roles" element={<GestionRoles />} />
        <Route path="/productos" element={<GestionProductos />} />
        <Route path="/categorias" element={<GestionCategorias />} />
        <Route path="/catalogo" element={<GestionArchivos />} />
        {/* 🚨 Ruta no encontrada */}
        <Route path="*" element={<h1 className="p-6 text-2xl">404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
