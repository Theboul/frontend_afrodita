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
  const [formData, setFormData] = useState<Partial<UsuarioRegistro>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = async (data: Partial<UsuarioRegistro>) => {
    setLoading(true);
    try {
      if (step === 1) {
        // Validar con esquema del paso 1
        step1UsuarioSchema.parse(data);
         // Llamar backend paso 1
        await registrarStep1({
          nombre_usuario: data.nombre_usuario!,
          correo: data.correo!,
          password: data.password!,
          confirm_password: data.confirmPassword!,
        });

        // Guardar datos localmente
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
      } else if (step === 2) {
        // Validar con esquema del paso 2
        step2UsuarioSchema.parse(data);
        const finalData = { ...formData, ...data } as UsuarioRegistro;

        // Llamar backend paso 2 → crea el cliente
        const res = await registrarStep2(finalData);

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
          setMensaje("Error inesperado");
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