import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import UsuarioForm from "../../components/ui/UsuarioForm";
import { registrarStep1, registrarStep2 } from "../../services/cliente/clienteService";
import { type UsuarioRegistro } from "../../validation/usuarioSchema";
import { step1UsuarioSchema, step2UsuarioSchema } from "../../validation/usuarioSchema";

export default function RegistroClientePage() {
  const [mensaje, setMensaje] = useState("");
  const [step, setStep] = useState(1); // Paso actual
  const [step1Data, setStep1Data] = useState<{
    nombre_usuario: string;
    correo: string;
    password: string;
  } | null>(null); // Guardar datos del paso 1
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = async (data: Partial<UsuarioRegistro>) => {
    setLoading(true);
    try {
      if (step === 1) {
        // Validar con esquema del paso 1
        step1UsuarioSchema.parse(data);
         // Llamar backend paso 1 (solo validación)
        await registrarStep1({
          nombre_usuario: data.nombre_usuario!,
          correo: data.correo!,
          password: data.password!, // La función lo convierte a "contraseña"
          confirmar_password: data.confirmPassword!, // La función lo convierte a "confirmar_contraseña"
        });

        // Guardar datos del paso 1 para enviarlos en el paso 2
        setStep1Data({
          nombre_usuario: data.nombre_usuario!,
          correo: data.correo!,
          password: data.password!,
        });

        // Pasar al siguiente paso
        setStep(2);
      } else if (step === 2) {
        // Validar con esquema del paso 2
        step2UsuarioSchema.parse(data);
        
        if (!step1Data) {
          setMensaje("Error: Datos del paso 1 no encontrados");
          return;
        }

        // Llamar backend paso 2 con TODOS los datos
        const res = await registrarStep2({
          // Datos del paso 1
          nombre_usuario: step1Data.nombre_usuario,
          correo: step1Data.correo,
          password: step1Data.password,
          // Datos del paso 2
          nombre_completo: data.nombre_completo!,
          telefono: data.telefono,
          sexo: data.sexo || "N",
        });

        setMensaje(res.mensaje || "Registro exitoso");

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: any) {
        if (err.response) {
          const data = await err.response.json();
          if (data.errores) {
            const firstError = Object.values(data.errores)[0] as string[];
            setMensaje(firstError[0]);
          } else {
            setMensaje(data.mensaje || "Error en el registro");
          }
        } else {
          setMensaje(err.message || "Error inesperado");
        }
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
             {step === 1 ? "Crea tu cuenta" : "Completa tu perfil"}
          </h2>
          <UsuarioForm step={step as 1 | 2} onSubmit={handleNext} loading={loading} />
          {mensaje && <p className="mt-4 text-center font-medium text-gray-700">{mensaje}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}