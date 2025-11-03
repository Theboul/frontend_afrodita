import { useEffect, useState } from "react";
import { 
  soporteClienteService, 
  type Ticket, 
  type TicketDetalle 
} from "../../../services/cliente/soporteClienteService";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import TicketDetalleClienteModal from "../../../components/soporte/TicketDetalleClienteModal";
import toast from "react-hot-toast";

export default function PerfilSoporte() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<TicketDetalle | null>(null);

  useEffect(() => {
    cargarTickets();
  }, []);

  // 🔹 Cargar tickets personales del cliente
  const cargarTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await soporteClienteService.listarMisTickets();
      if (res.success && res.data?.tickets) {
        setTickets(res.data.tickets);
      } else {
        setTickets([]);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Abrir modal (ver detalle de un ticket)
  const handleVerDetalle = async (id: number) => {
    try {
      console.log("🎫 Obteniendo detalle del ticket:", id);
      const res = await soporteClienteService.obtenerMiTicket(id);
      console.log("🎫 Respuesta completa:", res);
      console.log("🎫 Ticket data:", res.data);
      
      if (res.success && res.data) {
        setTicketSeleccionado(res.data);
        setModalVisible(true);
      } else {
        toast.error("No se pudo cargar el ticket");
      }
    } catch (error) {
      console.error("❌ Error al obtener ticket:", error);
      toast.error("Error al obtener el detalle del ticket");
    }
  };

  // 🔹 Responder ticket
  const handleResponder = async (mensaje: string) => {
    if (!ticketSeleccionado) return;
    try {
      const res = await soporteClienteService.responderTicket(ticketSeleccionado.id_ticket, { mensaje });
      if (res.success) {
        toast.success("Respuesta enviada ✅");
        await cargarTickets();
        setModalVisible(false);
      }
    } catch {
      toast.error("Error al enviar respuesta");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Mis Tickets de Soporte</h2>
        <Button label="Nuevo Ticket" color="primary" onClick={() => toast("Función en desarrollo")} />
      </div>

      {/* Estado de carga / error / vacío */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          Cargando tus tickets...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tienes tickets enviados"
          description="Cuando necesites ayuda, crea un ticket para soporte."
        />
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div key={t.id_ticket} className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-semibold text-gray-800">#{t.id_ticket} — {t.asunto}</p>
                <p className="text-sm text-gray-600">Estado: {t.estado}</p>
                <p className="text-sm text-gray-500">Fecha: {new Date(t.fecha_creacion).toLocaleDateString("es-ES")}</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button label="Ver Detalle" color="primary" onClick={() => handleVerDetalle(t.id_ticket)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {modalVisible && ticketSeleccionado && (
        <TicketDetalleClienteModal
          show={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setTicketSeleccionado(null);
          }}
          ticket={ticketSeleccionado}
          onResponder={handleResponder}
        />
      )}
    </div>
  );
}
