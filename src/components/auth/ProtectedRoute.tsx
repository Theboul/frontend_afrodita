import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

/**
 * Componente para proteger rutas según autenticación y rol del usuario.
 * - Redirige al login si no está autenticado.
 * - Redirige al dashboard si el rol no está permitido.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  // No autenticado → login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Tiene sesión, pero rol no permitido
  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toUpperCase()).includes(user.rol.toUpperCase())
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Usuario válido → renderiza contenido
  return <>{children}</>;
}
