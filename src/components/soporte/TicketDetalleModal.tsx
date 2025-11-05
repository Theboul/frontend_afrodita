import { useState } from "react";
import { type TicketDetalle } from "../../services/soporte/soporteService";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  onClose: () => void;
  ticket?: TicketDetalle; // opcional: ?
  onResponder: (mensaje: string) => Promise<void>;
}

export default function TicketDetalleModal({ show, onClose, ticket, onResponder }: Props) {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // Evita renderizar si aún no hay ticket
  if (!show || !ticket) return null;

  const handleEnviar = async () => {
    if (!mensaje.trim()) {
      toast.error("El mensaje no puede estar vacío ❌");
      return;
    }
    setLoading(true);
    try {
      await onResponder(mensaje.trim());
      setMensaje("");
      toast.success("Mensaje enviado ✅");
      onClose();
    } catch {
      toast.error("Error al enviar el mensaje ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-lg p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
          Responder Ticket #{ticket.id_ticket}
        </h2>

        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
        />

        <div className="flex justify-end mt-4 gap-2">
          <Button label="Cancelar" color="info" onClick={onClose} />
          <Button
            label={loading ? "Enviando..." : "Enviar Respuesta"}
            color="primary"
            onClick={handleEnviar}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
