import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación
import LoginForm from "./pages/auth/Login";
import RegistroClientePage from "./pages/auth/RegistroCliente";

// Páginas del dashboard
import GestionRoles from "./pages/usuarios/GestionRoles";
import GestionProductos from "./pages/productos/GestionProductos";
import ListaCategorias from "./pages/categoria/ListaCategorias";
import GestionUsuarios from "./pages/usuarios/GestionUsuarios";
import GestionArchivos from "./pages/archivos/CatalogoArchivos";
import BitacoraPage from "./pages/bitacora/BitacoraPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import GestionarCompra from "./pages/productos/GestionarCompra";
import GestionarCuentaCliente from "./pages/usuarios/GestionarCuentaCliente";
import GestionarProveedores from "./pages/Proveedores/GestionarProveedores";


import DashboardCliente from "./clientes/pages/productos/DashboardCliente"; 
import CatalogoCliente from "./clientes/pages/productos/Catalogo";
import ContactoCliente from "./clientes/pages/productos/Contacto";
import PreguntasFrecuentes from "./clientes/pages/productos/PreguntasFrecuentes";



// Layouts y estilos
import DashboardLayout from "./layouts/DashboardLayout";
import "./styles/globals.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
       {/* Rutas para el cliente */}
      <Route
        path="/dashboard-cliente"
        element={
   
          <DashboardCliente />
        }
      />

      <Route
        path="/catalogo-cliente"
        element={
   
          <CatalogoCliente/>
        }
      />

      <Route
        path="/contacto-cliente"
        element={
   
          <ContactoCliente/>
        }
      />

      <Route
        path="/preguntas-cliente"
        element={
   
          <PreguntasFrecuentes/>
        }
      />

        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas (autenticación) */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegistroClientePage />} />

        {/* Rutas del dashboard (todas con el Sidebar incluido) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/roles"
          element={
            <DashboardLayout>
              <GestionRoles />
            </DashboardLayout>
          }
        />
        <Route
          path="/productos"
          element={
            <DashboardLayout>
              <GestionProductos />
            </DashboardLayout>
          }
        />
        <Route
          path="/categorias"
          element={
            <DashboardLayout>
              <ListaCategorias />
            </DashboardLayout>
          }
        />
        <Route
          path="/usuarios"
          element={
            <DashboardLayout>
              <GestionUsuarios />
            </DashboardLayout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <DashboardLayout>
              <GestionArchivos />
            </DashboardLayout>
          }
        />
        <Route
          path="/bitacora"
          element={
            <DashboardLayout>
              <BitacoraPage />
            </DashboardLayout>
          }
        />
         <Route
          path="/gestionar-compra"
          element={
            <DashboardLayout>
              <GestionarCompra />
            </DashboardLayout>
          }
        />
        <Route
          path="/gestionar-cuentacliente"
          element={
            <DashboardLayout>
              <GestionarCuentaCliente />
            </DashboardLayout>
          }
        />
        <Route
          path="/proveedores"
          element={
            <DashboardLayout>
              <GestionarProveedores />
            </DashboardLayout>
          }
        />
        {/* Ruta no encontrada */}
        <Route
          path="*"
          element={
            <h1 className="p-6 text-2xl font-semibold text-red-600">
              404 - Página no encontrada
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
