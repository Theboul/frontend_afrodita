import { useState } from "react";
import { Button } from "../ui/Button";

interface CrearTicketModalProps {
  show: boolean;
  onClose: () => void;
  onCrear: (data: { asunto: string; tipo_consulta: string; mensaje: string }) => Promise<void>;
}

const TIPOS_CONSULTA = [
  { value: "RECLAMO", label: "Reclamo" },
  { value: "DUDA", label: "Duda" },
  { value: "PEDIDO", label: "Pedido" },
  { value: "SUGERENCIA", label: "Sugerencia" },
  { value: "OTRO", label: "Otro" },
];

export default function CrearTicketModal({ show, onClose, onCrear }: CrearTicketModalProps) {
  const [formData, setFormData] = useState({
    asunto: "",
    tipo_consulta: "DUDA",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!show) return null;

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido";
    } else if (formData.asunto.length < 5) {
      newErrors.asunto = "El asunto debe tener al menos 5 caracteres";
    } else if (formData.asunto.length > 100) {
      newErrors.asunto = "El asunto no puede exceder 100 caracteres";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    } else if (formData.mensaje.length > 1000) {
      newErrors.mensaje = "El mensaje no puede exceder 1000 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await onCrear(formData);
      // Resetear formulario
      setFormData({
        asunto: "",
        tipo_consulta: "DUDA",
        mensaje: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error al crear ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🎫 Crear Nuevo Ticket</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asunto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asunto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.asunto}
              onChange={(e) => handleChange("asunto", e.target.value)}
              placeholder="Escribe un resumen breve del problema"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.asunto
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
              disabled={loading}
              maxLength={100}
            />
            {errors.asunto && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.asunto}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.asunto.length}/100 caracteres
            </p>
          </div>

          {/* Tipo de Consulta */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Consulta <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipo_consulta}
              onChange={(e) => handleChange("tipo_consulta", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={loading}
            >
              {TIPOS_CONSULTA.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.mensaje}
              onChange={(e) => handleChange("mensaje", e.target.value)}
              placeholder="Describe detalladamente tu consulta o problema..."
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.mensaje
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
              disabled={loading}
              maxLength={1000}
            />
            {errors.mensaje && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.mensaje}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.mensaje.length}/1000 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <Button
              label={loading ? "Creando..." : "Crear Ticket"}
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth
            />
          </div>
        </form>
      </div>
    </div>
  );
}
