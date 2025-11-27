import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from "./components/common/LoadingFallback";
import "./styles/globals.css";

// Componentes que se cargan inmediatamente (críticos para UX)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import GestionarDevoluciones from "./pages/devoluciones/GestionarDevoluciones";
import MisDevoluciones from "./pages/devoluciones/MisDevoluciones";
import MisDevolucionesCliente from "./pages/devoluciones/MisDevolucionesCliente";
import FormularioDevolucionCliente from "./pages/devoluciones/FormularioDevolucionCliente";


// ========================================
// LAZY LOADING - Componentes cargados bajo demanda
// ========================================

// Páginas de autenticación
const LoginForm = lazy(() => import("./pages/auth/Login"));
const RegistroClientePage = lazy(() => import("./pages/auth/RegistroCliente"));

// Páginas del cliente (alta prioridad)
const DashboardCliente = lazy(() => import("./clientes/pages/productos/DashboardCliente"));
const CatalogoCliente = lazy(() => import("./clientes/pages/productos/Catalogo"));
const ContactoCliente = lazy(() => import("./clientes/pages/productos/Contacto"));
const PreguntasFrecuentes = lazy(() => import("./clientes/pages/productos/PreguntasFrecuentes"));
const Carrito = lazy(() => import("./clientes/pages/productos/Carrito"));

// Perfil cliente
const PerfilClienteLayout = lazy(() => import("./clientes/pages/perfilCliente/PerfilClienteLayout"));
const PerfilInfo = lazy(() => import("./clientes/pages/perfilCliente/PerfilInfo"));
const PerfilCompras = lazy(() => import("./clientes/pages/perfilCliente/PerfilCompras"));
const PerfilDirecciones = lazy(() => import("./clientes/pages/perfilCliente/PerfilDirecciones"));
const PerfilSoporte = lazy(() => import("./clientes/pages/perfilCliente/PerfilSoporte"));

// Páginas del dashboard administrativo
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const GestionProductos = lazy(() => import("./pages/productos/GestionProductos"));
const ListaCategorias = lazy(() => import("./pages/categoria/ListaCategorias"));
const GestionUsuarios = lazy(() => import("./pages/usuarios/GestionUsuarios"));
const ListaClientes = lazy(() => import("./pages/usuarios/ListaClientes"));
const GestionArchivos = lazy(() => import("./pages/archivos/CatalogoArchivos"));
const BitacoraPage = lazy(() => import("./pages/bitacora/BitacoraPage"));
const GestionarCompra = lazy(() => import("./pages/productos/GestionarCompra"));
const GestionarCuentaCliente = lazy(() => import("./pages/usuarios/GestionarCuentaCliente"));
const GestionInventario = lazy(() => import("./pages/inventario/GestionInventario"));
const GestionLotes = lazy(() => import("./pages/lotes/GestionLotes"));
const NotaVenta = lazy(() => import("./pages/ventas/NotaVenta"));
const GestionarVentas = lazy(() => import("./pages/ventas/GestionarVentas"));

// Páginas de seguridad
const GestionRoles = lazy(() => import("./pages/seguridad/GestionRoles"));
const GestionPermisos = lazy(() => import("./pages/seguridad/GestionPermisos"));
const GestionPermisosIndividuales = lazy(() => import("./pages/seguridad/GestionPermisosIndividuales"));

// Páginas de soporte
const SoporteList = lazy(() => import("./pages/soporte/SoporteList"));
const SoporteDetalle = lazy(() => import("./pages/soporte/SoporteDetalle"));
const GestionarPolitica = lazy(() => import("./pages/politica/GestionarPolitica"));

// Pagos
const MetodosPagoPage = lazy(() => import("./pages/pagos/MetodosPago"));
const PagoEnLinea = lazy(() => import("./pages/ventas/PagoEnLinea"));
const GestionReportes = lazy(() => import("./pages/reportes/GestionReportes"));


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ========================================
              RUTAS PARA EL CLIENTE
          ======================================== */}
          <Route path="/dashboard-cliente" element={<DashboardCliente />} />
          <Route path="/catalogo-cliente" element={<CatalogoCliente />} />
          <Route path="/contacto-cliente" element={<ContactoCliente />} />
          <Route path="/preguntas-cliente" element={<PreguntasFrecuentes />} />
          <Route path="/carrito-cliente" element={<Carrito />} />

          {/* ========================================
              REDIRECCIÓN INICIAL Y AUTENTICACIÓN
          ======================================== */}
          <Route path="/" element={<Navigate to="/dashboard-cliente" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegistroClientePage />} />


          <Route
            path="/perfil-cliente"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <PerfilClienteLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PerfilInfo />} />
            <Route path="info" element={<PerfilInfo />} />
            <Route path="compras" element={<PerfilCompras />} />
            <Route path="direcciones" element={<PerfilDirecciones />} />
            <Route path="soporte" element={<PerfilSoporte />} />
          </Route>

          {/* ========================================
              PAGOS (DEMO / EN LÍNEA)
          ======================================== */}
          <Route
            path="/pagos/linea"
            element={
              <DashboardLayout>
                <PagoEnLinea />
              </DashboardLayout>
            }
          />

          <Route
            path="/pagos/metodos"
            element={
              <DashboardLayout>
                <MetodosPagoPage />
              </DashboardLayout>
            }
          />

          <Route
            path="/ventas"
            element={
              <DashboardLayout>
                <GestionarVentas />
              </DashboardLayout>
            }
          />

          <Route
            path="/venta/nota/:id"
            element={
              <DashboardLayout>
                <NotaVenta />
              </DashboardLayout>
            }
          />

          <Route
  path="/devoluciones/solicitar/:id_compra"
  element={<FormularioDevolucionCliente />}
/>


<Route path="/mis-devoluciones" element={<MisDevolucionesCliente />} />
<Route path="/devoluciones/solicitar/:id_compra" element={<FormularioDevolucionCliente />} />

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


          <Route
            path="/inventario"
            element={
              <DashboardLayout>
                <GestionInventario />
              </DashboardLayout>
            }
          />
          <Route
            path="/lotes"
            element={
              <DashboardLayout>
                <GestionLotes />
              </DashboardLayout>
            }
          />

       <Route
  path="/devoluciones"
  element={
    <DashboardLayout>
      <GestionarDevoluciones />
    </DashboardLayout>
  }
/>

          <Route
  path="/mis-devoluciones"
  element={
    <DashboardLayout>
      <GestionarDevoluciones />
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
          <Route
            path="/reportes"
            element={
              <DashboardLayout>
                <GestionReportes />
              </DashboardLayout>
            }
          />

          <Route
            path="/politica/gestionar"
            element={
              <DashboardLayout>
                <GestionarPolitica />
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
        RUTAS DE SOPORTE (ADMINISTRADOR)
        ======================================= */}
          <Route
            path="/soporte"
            element={
              <DashboardLayout>
                <SoporteList />
              </DashboardLayout>
            }
          />

          <Route
            path="/soporte/:id"
            element={
              <DashboardLayout>
                <SoporteDetalle />
              </DashboardLayout>
            }
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
