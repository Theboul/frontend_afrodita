import { Users, Package, ShoppingCart, ShieldCheck, BarChart3, Boxes } from "lucide-react";

export const menuModules = [
  {
    label: "Autenticacion y Seguridad",
    icon: ShieldCheck,
    items: [
      { label: "Gestionar Usuarios", to: "/usuarios" },
      { label: "Roles y Permisos", to: "/roles" },
      { label: "Recuperar Contrasena", to: "/recuperar" },
    ],
  },

  {
    label: "Gestion de Clientes",
    icon: Users,
    items: [
      { label: "Gestionar Clientes", to: "/clientes" },
      { label: "Registrar Cliente", to: "/clientes/registro" },
      { label: "Gestionar Contacto / Soporte", to: "/soporte" },
      { label: "Gestionar Resenas de Productos", to: "/clientes/resenas" },
    ],
  },

  {
    label: "Catalogo de Productos",
    icon: Package,
    items: [
      { label: "Gestionar Productos", to: "/productos" },
      { label: "Gestionar Categorias", to: "/categorias" },
      { label: "Gestionar Archivos del Catalogo", to: "/catalogo" },
      { label: "Consultar Catalogo con Filtros", to: "/catalogo/filtros" },
    ],
  },

  {
    label: "Inventario y Compras",
    icon: Boxes,
    items: [
      { label: "Gestionar Proveedores", to: "/proveedores" },
      { label: "Gestionar Compras", to: "/gestionar-compra" },
      { label: "Gestionar Inventario", to: "/inventario" },
      { label: "Gestionar Lotes y Caducidades", to: "/lotes" },
      { label: "Generar Nota de Compra", to: "/compras/nota" },
    ],
  },

  {
    label: "Ventas y Pagos",
    icon: ShoppingCart,
    items: [
      { label: "Gestionar Carrito", to: "/ventas/carrito" },
      { label: "Gestionar Ventas", to: "/ventas" },
      { label: "Devoluciones y Reembolsos", to: "/ventas/reembolsos" },
      { label: "Metodos de Pago", to: "/pagos/metodos" },
      { label: "Procesar Pago en Linea", to: "/pagos/linea" },
      { label: "Conciliar Transacciones", to: "/pagos/conciliacion" },
      { label: "Gestionar Promociones", to: "/promociones" },
      { label: "Gestionar Envios", to: "/envios" },
    ],
  },

  {
    label: "Reportes y Configuracion",
    icon: BarChart3,
    items: [
      { label: "Gestionar Reportes", to: "/reportes" },
      { label: "Configurar Politicas del Sistema", to: "/politica/gestionar" },
      { label: "Auditoria / Bitacora", to: "/bitacora" },
    ],
  },
];
