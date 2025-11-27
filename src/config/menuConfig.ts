import { Users, Package, ShoppingCart, ShieldCheck, BarChart3, Boxes} from "lucide-react";

export const menuModules = [
  // Autenticación y Seguridad
  {
    label: "Autenticación y Seguridad",
    icon: ShieldCheck,
    items: [
      { label: "Gestionar Usuarios", to: "/usuarios" },
      { label: "Roles y Permisos", to: "/roles" },
      { label: "Recuperar Contraseña", to: "/recuperar" },
    ],
  },

  // Gestión de Clientes
  {
    label: "Gestión de Clientes",
    icon: Users,
    items: [
      { label: "Gestionar Clientes", to: "/clientes" },
      { label: "Registrar Cliente", to: "/clientes/registro" },
      { label: "Gestionar Contacto / Soporte", to: "/soporte" },
      { label: "Gestionar Reseñas de Productos", to: "/clientes/reseñas" },
     
    ],
  },

  // Catálogo de Productos
  {
    label: "Catálogo de Productos",
    icon: Package,
    items: [
      { label: "Gestionar Productos", to: "/productos" },
      { label: "Gestionar Categorías", to: "/categorias" },
      { label: "Gestionar Archivos del Catálogo", to: "/catalogo" },
      { label: "Consultar Catálogo con Filtros", to: "/catalogo/filtros" },
    ],
  },

  // Inventario y Compras
  {
    label: "Inventario y Compras",
    icon: Boxes,
    items: [
      { label: "Gestionar Proveedores", to: "/proveedores" },
      { label: "Gestionar Compras", to: "/gestionar-compra"} ,
      { label: "Gestionar Inventario", to: "/inventario" },
      { label: "Gestionar Lotes y Caducidades", to: "/lotes" },
      { label: "Generar Nota de Compra", to: "/compras/nota" },
    ],
  },

  // Ventas y Pagos
  {
    label: "Ventas y Pagos",
    icon: ShoppingCart,
    items: [
      { label: "Gestionar Carrito", to: "/ventas/carrito" },
      { label: "Gestionar Ventas", to: "/ventas" },
      { label: "Devoluciones y Reembolsos", to: "/ventas/reembolsos" },
      { label: "Métodos de Pago", to: "/pagos/metodos" },
      { label: "Procesar Pago en Línea", to: "/pagos/linea" },
      { label: "Conciliar Transacciones", to: "/pagos/conciliacion" },
      { label: "Gestionar Promociones", to: "/promociones" },
      { label: "Gestionar Envíos", to: "/envios" },
    ],
  },

  // Reportes y Configuración
  {
    label: "Reportes y Configuración",
    icon: BarChart3,
    items: [
      { label: "Gestionar Reportes", to: "/reportes" },
      { label: "Configurar Políticas del Sistema", to: "/politica/gestionar" },
      { label: "Auditoría / Bitácora", to: "/bitacora" },
    ],
  },



];
