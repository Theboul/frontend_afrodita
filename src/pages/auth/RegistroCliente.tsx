import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import UsuarioForm from "../../components/ui/UsuarioForm";
import { registrarCliente } from "../../services/clienteService";
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
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
      } else if (step === 2) {
        // Validar con esquema del paso 2
        step2UsuarioSchema.parse(data);
        const finalData = { ...formData, ...data } as UsuarioRegistro;

        // Enviar al backend
        const res = await registrarCliente(finalData);
        setMensaje(res.mensaje || "Registro exitoso ✅");

        // Redirigir después de 2 segundos
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: any) {
      setMensaje(err.errors?.[0]?.message || "Error en la validación ❌");
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