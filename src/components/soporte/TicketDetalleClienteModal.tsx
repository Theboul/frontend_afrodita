import { useState } from "react";
import { type TicketDetalle, type Mensaje } from "../../services/cliente/soporteClienteService";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { MessageCircle, User, Clock } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  ticket?: TicketDetalle;
  onResponder: (mensaje: string) => Promise<void>;
}

export default function TicketDetalleClienteModal({ show, onClose, ticket, onResponder }: Props) {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
      setMostrarFormulario(false);
      toast.success("Respuesta enviada ✅");
    } catch {
      toast.error("Error al enviar el mensaje ❌");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "abierto":
        return "bg-green-100 text-green-700";
      case "en_proceso":
        return "bg-blue-100 text-blue-700";
      case "resuelto":
        return "bg-gray-100 text-gray-700";
      case "cerrado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Ticket #{ticket.id_ticket}
              </h2>
              <p className="text-pink-100 text-lg">{ticket.asunto}</p>
              <div className="flex gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoColor(ticket.estado)}`}>
                  {ticket.estado_display || ticket.estado}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {ticket.tipo_display || ticket.tipo_consulta}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 text-2xl font-bold transition"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mensaje inicial */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Mensaje inicial</span>
              <span className="text-sm text-blue-600 ml-auto">
                {formatearFecha(ticket.fecha_creacion)}
              </span>
            </div>
            <p className="text-gray-800">{ticket.mensaje}</p>
          </div>

          {/* Mensajes/Respuestas */}
          {ticket.mensajes && ticket.mensajes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Historial de conversación
              </h3>
              
              {ticket.mensajes.map((msg: Mensaje) => (
                <div
                  key={msg.id_mensaje}
                  className={`p-4 rounded-lg ${
                    msg.es_respuesta_agente
                      ? "bg-purple-50 border-l-4 border-purple-500"
                      : "bg-gray-50 border-l-4 border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {msg.usuario_nombre || "Usuario"}
                    </span>
                    {msg.es_respuesta_agente && (
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                        Soporte
                      </span>
                    )}
                    <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatearFecha(msg.fecha_envio)}
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm">{msg.mensaje}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formulario de respuesta */}
          {mostrarFormulario ? (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h4 className="font-semibold text-pink-900 mb-3">Escribe tu respuesta</h4>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  label="Cancelar"
                  color="info"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setMensaje("");
                  }}
                />
                <Button
                  label={loading ? "Enviando..." : "Enviar Respuesta"}
                  color="primary"
                  onClick={handleEnviar}
                  disabled={loading || !mensaje.trim()}
                />
              </div>
            </div>
          ) : (
            ticket.puede_responder && (
              <div className="text-center pt-4">
                <Button
                  label="Responder Ticket"
                  color="primary"
                  onClick={() => setMostrarFormulario(true)}
                />
              </div>
            )
          )}

          {!ticket.puede_responder && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center text-sm">
              ℹ️ Este ticket ya no acepta más respuestas
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            Agente asignado: <span className="font-semibold">{ticket.agente_nombre || "Sin asignar"}</span>
          </div>
          <Button label="Cerrar" color="info" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
