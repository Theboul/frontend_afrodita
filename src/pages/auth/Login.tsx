import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { authService } from "../../services/auth/authService";
import { loginSchema, type LoginFormData } from "../../validation/usuarioSchema";
import "../../styles/LoginForm.css";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    credencial: "",
    contraseña: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated, user } = useAuthStore();

  // Redirigir según el rol del usuario cuando esté autenticado
  useEffect(() => {
    console.log('🔍 Login useEffect ejecutado:', { isAuthenticated, username: user?.username, rol: user?.rol });
    
    if (isAuthenticated && user) {
      // Función de redirección dentro del useEffect
      const redirectByRole = (rol: string) => {
        console.log('🚀 Redirigiendo usuario con rol:', rol);
        
        switch (rol) {
          case "ADMINISTRADOR":
          case "VENDEDOR":
            console.log('➡️ Navegando a /dashboard');
            navigate("/dashboard");
            break;
          case "CLIENTE":
            console.log('➡️ Navegando a /catalogo-cliente');
            navigate("/catalogo-cliente"); // Redirige a clientes al catálogo
            break;
          default:
            console.log('➡️ Navegando a /');
            navigate("/");
        }
      };
      
      redirectByRole(user.rol);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Validación inmediata al escribir con Zod
    try {
      loginSchema.pick({ [id]: true }).parse({ [id]: value });
      setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    } catch (err: any) {
      const msg = (err?.errors && err.errors[0]?.message)
        || (err?.issues && err.issues[0]?.message)
        || 'Dato inválido';
      setFormErrors((prev) => ({ ...prev, [id]: msg }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    console.log('📝 Formulario enviado con datos:', { credencial: formData.credencial });

    // Validación completa con Zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);

      // Enfocar el primer campo con error
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) document.getElementById(firstError)?.focus();
      return;
    }

    try {
      console.log('🔐 Intentando login...');
      await login(formData);
      console.log('✅ Login completado, estado debería actualizarse');
    } catch (err) {
      console.error("❌ Login error:", err);
    }
  };

  console.log('🔄 Componente Login renderizando. Estado:', { isAuthenticated, userExists: !!user, loading });

  if (isAuthenticated) {
    console.log('⏳ Mostrando pantalla de redirección...');
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Contenido principal */}
      <main className="flex-grow">
        <div className="login-form-container">
          <div className="login-form">
            {/* Formulario de inicio de sesión */}
            <form onSubmit={handleSubmit} className="w-full md:w-1/2" noValidate>
              <h2>Iniciar Sesión</h2>

              {/* Campo: Usuario o correo */}
              <div className="form-group">
                <label htmlFor="credencial">Correo electrónico</label>
                <input
                  id="credencial"
                  name="username"
                  autoComplete="username"
                  type="text"
                  value={formData.credencial}
                  onChange={handleChange}
                  className={formErrors.credencial ? "error" : ""}
                  placeholder="usuario@ejemplo.com"
                  disabled={loading}
                />
                {formErrors.credencial && (
                  <span className="error-message">{formErrors.credencial}</span>
                )}
              </div>

              {/* Campo: Contraseña */}
              <div className="form-group">
                <label htmlFor="contraseña">Contraseña</label>
                <input
                  id="contraseña"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className={formErrors.contraseña ? "error" : ""}
                  placeholder="••••••"
                  disabled={loading}
                />
                {formErrors.contraseña && (
                  <span className="error-message">{formErrors.contraseña}</span>
                )}
              </div>

              {/* Recordarme y olvidar contraseña */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Recordar contraseña</span>
                </label>

                <Link to="/forgot-password" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Errores globales */}
              {error && (
                <div className="error-banner" role="alert">
                  {authService.getErrorMessage(error)}
                </div>
              )}

              {/* Botón de envío */}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar"
                )}
              </button>

              {/* Enlace de registro */}
              <div className="register-link">
                <p>
                  ¿No tienes cuenta aún?{" "}
                  <Link to="/registro" className="create-account">
                    Crear una cuenta
                  </Link>
                </p>
              </div>
            </form>

            {/* Imagen decorativa */}
            <div className="login-image">
              <img src="/assets/urban_layer.png" alt="Urban Layer" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer fijo al final de la página */}
      <Footer />
    </div>
  );
};

export default LoginForm;
