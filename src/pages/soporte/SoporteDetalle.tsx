import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { soporteService, type TicketDetalle } from "../../services/soporte/soporteService";
import ModuleLayout from "../../layouts/ModuleLayout";
import Button from "../../components/ui/Button";
import TicketDetalleModal from "../../components/soporte/TicketDetalleModal";
import toast from "react-hot-toast";

export default function SoporteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<TicketDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(false);

  const cargarTicket = async (idTicket: number) => {
    setLoading(true);
    try {
      console.log("🎫 Cargando ticket ID:", idTicket);
      const res = await soporteService.obtenerTicket(idTicket);
      console.log("🎫 Respuesta:", res);
      
      if (res.success && res.data) {
        setTicket(res.data);
      } else {
        toast.error(res.message || "Error al cargar el ticket");
      }
    } catch (err: any) {
      console.error("❌ Error al cargar ticket:", err);
      toast.error("No se pudo cargar el ticket ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) cargarTicket(Number(id));
  }, [id]);

  const handleResponder = async (mensaje: string) => {
    if (!ticket) return;
    try {
      console.log("💬 Respondiendo ticket:", ticket.id_ticket);
      const res = await soporteService.responderTicket(ticket.id_ticket, { mensaje });
      console.log("💬 Respuesta responder:", res);
      
      if (res.success) {
        toast.success("Respuesta enviada ✅");
        await cargarTicket(ticket.id_ticket);
      } else {
        toast.error(res.message || "Error al responder");
      }
    } catch (err: any) {
      console.error("❌ Error al responder:", err);
      toast.error("Error al enviar la respuesta ❌");
    }
  };

  const handleCerrar = async () => {
    if (!ticket) return;
    try {
      console.log("🗃️ Cerrando ticket:", ticket.id_ticket);
      const res = await soporteService.cerrarTicket(ticket.id_ticket);
      console.log("🗃️ Respuesta cerrar:", res);
      
      if (res.success) {
        toast.success("Ticket cerrado 🗃️");
        await cargarTicket(ticket.id_ticket);
      } else {
        toast.error(res.message || "Error al cerrar");
      }
    } catch (err: any) {
      console.error("❌ Error al cerrar:", err);
      toast.error("Error al cerrar el ticket ❌");
    }
  };

  const handleReabrir = async () => {
    if (!ticket) return;
    try {
      console.log("🔄 Reabriendo ticket:", ticket.id_ticket);
      const res = await soporteService.reabrirTicket(ticket.id_ticket);
      console.log("🔄 Respuesta reabrir:", res);
      
      if (res.success) {
        toast.success("Ticket reabierto 🔄");
        await cargarTicket(ticket.id_ticket);
      } else {
        toast.error(res.message || "Error al reabrir");
      }
    } catch (err: any) {
      console.error("❌ Error al reabrir:", err);
      toast.error("Error al reabrir el ticket ❌");
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Detalle del Ticket">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </ModuleLayout>
    );
  }

  if (!ticket) {
    return (
      <ModuleLayout title="Detalle del Ticket">
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontró información del ticket</p>
          <Button label="Volver" color="info" onClick={() => navigate("/soporte")} />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title={`Ticket #${ticket.id_ticket} — ${ticket.asunto}`}>
      <div className="space-y-4">
        <Button label="← Volver a Soporte" color="info" onClick={() => navigate("/soporte")} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">{ticket.asunto}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                ticket.estado === "CERRADO"
                  ? "bg-red-100 text-red-700"
                  : ticket.estado === "EN_PROCESO"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {ticket.estado}
            </span>
          </div>
          <p className="mt-2 text-gray-600">Cliente: {ticket.cliente_nombre}</p>
          {ticket.agente_nombre && <p className="text-gray-600">Atendido por: {ticket.agente_nombre}</p>}
          <p className="text-sm text-gray-500 mt-1">Creado: {new Date(ticket.fecha_creacion).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Mensajes</h3>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {ticket.mensajes.map((msg) => (
              <div
                key={msg.id_mensaje}
                className={`p-3 rounded-lg ${
                  msg.es_respuesta_agente ? "bg-pink-100 text-right" : "bg-gray-100 text-left"
                }`}
              >
                <p className="text-sm text-gray-700">{msg.mensaje}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {msg.usuario_nombre} — {new Date(msg.fecha_envio).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ticket.estado !== "CERRADO" ? (
            <>
              <Button label="Responder" color="primary" onClick={() => setModalDetalle(true)} />
              <Button label="Cerrar Ticket" color="danger" onClick={handleCerrar} />
            </>
          ) : (
            <Button label="Reabrir Ticket" color="success" onClick={handleReabrir} />
          )}
        </div>
      </div>

      {modalDetalle && (
        <TicketDetalleModal
          show={modalDetalle}
          onClose={() => setModalDetalle(false)}
          onResponder={handleResponder}
          ticket={ticket}
        />
      )}
    </ModuleLayout>
  );
}
