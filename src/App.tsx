import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación
import LoginForm from "./pages/auth/Login";
import RegistroClientePage from "./pages/auth/RegistroCliente";

// Páginas de seguridad
import GestionRoles from "./pages/seguridad/GestionRoles";
import GestionPermisos from "./pages/seguridad/GestionPermisos";
import GestionPermisosIndividuales from "./pages/seguridad/GestionPermisosIndividuales";

// Páginas del dashboard
import GestionProductos from "./pages/productos/GestionProductos";
import ListaCategorias from "./pages/categoria/ListaCategorias";
import GestionUsuarios from "./pages/usuarios/GestionUsuarios";
import ListaClientes from "./pages/usuarios/ListaClientes";
import GestionArchivos from "./pages/archivos/CatalogoArchivos";
import BitacoraPage from "./pages/bitacora/BitacoraPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import GestionarCompra from "./pages/productos/GestionarCompra";
import GestionarCuentaCliente from "./pages/usuarios/GestionarCuentaCliente";

// Páginas del cliente
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
        {/* ========================================
            RUTAS PARA EL CLIENTE
        ======================================== */}
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/catalogo-cliente" element={<CatalogoCliente />} />
        <Route path="/contacto-cliente" element={<ContactoCliente />} />
        <Route path="/preguntas-cliente" element={<PreguntasFrecuentes />} />

        {/* ========================================
            REDIRECCIÓN INICIAL Y AUTENTICACIÓN
        ======================================== */}
        <Route path="/" element={<Navigate to="/dashboard-cliente" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegistroClientePage />} />

        {/* ========================================
            RUTAS DEL DASHBOARD (CON SIDEBAR)
        ======================================== */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        {/* ========================================
            RUTAS DE SEGURIDAD
        ======================================== */}
        <Route
          path="/seguridad/roles"
          element={
            <DashboardLayout>
              <GestionRoles />
            </DashboardLayout>
          }
        />
        <Route
          path="/seguridad/permisos"
          element={
            <DashboardLayout>
              <GestionPermisos />
            </DashboardLayout>
          }
        />
        <Route
          path="/seguridad/permisos-individuales"
          element={
            <DashboardLayout>
              <GestionPermisosIndividuales />
            </DashboardLayout>
          }
        />

        {/* ========================================
            RUTAS DE PRODUCTOS Y CATEGORÍAS
        ======================================== */}
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
          path="/gestionar-compra"
          element={
            <DashboardLayout>
              <GestionarCompra />
            </DashboardLayout>
          }
        />

        {/* ========================================
            RUTAS DE USUARIOS Y CLIENTES
        ======================================== */}
        <Route
          path="/usuarios"
          element={
            <DashboardLayout>
              <GestionUsuarios />
            </DashboardLayout>
          }
        />
        <Route
          path="/clientes"
          element={
            <DashboardLayout>
              <ListaClientes />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/clientes/:id"
          element={
            <DashboardLayout>
              <GestionarCuentaCliente />
            </DashboardLayout>
          }
        />

        {/* ========================================
            RUTAS DE ARCHIVOS Y BITÁCORA
        ======================================== */}
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

        {/* ========================================
            COMPATIBILIDAD: Ruta antigua de roles
        ======================================== */}
        <Route
          path="/roles"
          element={<Navigate to="/seguridad/roles" replace />}
        />

        {/* ========================================
            RUTA NO ENCONTRADA
        ======================================== */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-4">Página no encontrada</p>
                <a 
                  href="/dashboard" 
                  className="text-pink-500 hover:text-pink-700 underline"
                >
                  Volver al Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;