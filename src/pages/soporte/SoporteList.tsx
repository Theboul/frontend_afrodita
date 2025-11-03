import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleLayout from "../../layouts/ModuleLayout";
import TicketEstadoBadge from "../../components/soporte/TicketEstadoBadge";
import { soporteService, type Ticket } from "../../services/soporte/soporteService";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function SoporteList() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const pageSize = 10;

  // filtros
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarTickets();
  }, [paginaActual, estado, tipo]);

  const cargarTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: paginaActual,
        page_size: pageSize,
        estado: estado || undefined,
        tipo: tipo || undefined,
        search: busqueda || undefined,
      };

      console.log("📋 Cargando tickets con params:", params);
      const response = await soporteService.listarTickets(params);
      console.log("📋 Respuesta completa:", response);
      
      if (response.success && response.data) {
        // La respuesta puede venir como {results: [], total: X} o directamente como array
        const ticketsData = response.data.results || response.data.tickets || response.data;
        const total = response.data.total || response.data.count || 0;
        const totalPages = response.data.total_pages || response.data.num_pages || Math.ceil(total / pageSize);
        
        console.log("✅ Tickets cargados:", ticketsData);
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setTotalTickets(total);
        setTotalPaginas(totalPages || 1);
      } else {
        console.log("⚠️ Respuesta sin éxito:", response.message);
        setTickets([]);
        toast.error(response.message || "Error al cargar tickets");
      }
    } catch (err: any) {
      console.error("❌ Error al cargar tickets:", err);
      console.error("❌ Error response:", err.response?.data);
      setError(err.message || "Error al cargar tickets");
      toast.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(1);
    cargarTickets();
  };

  const handleVerTicket = (id: number) => {
    navigate(`/soporte/${id}`);
  };

  return (
    <ModuleLayout title="Gestión de Tickets de Soporte">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-end gap-4">
          <form onSubmit={handleBuscar} className="flex flex-wrap gap-3 flex-1">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="RESPONDIDO">Respondido</option>
                <option value="CERRADO">Cerrado</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Todos</option>
                <option value="RECLAMO">Reclamo</option>
                <option value="DUDAS">Dudas</option>
                <option value="SUGERENCIA">Sugerencia</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por asunto o cliente..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <Button label="🔍 Buscar" color="primary" type="submit" />
          </form>
        </div>

        {/* Lista de tickets */}
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Cargando tickets...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600">No se encontraron tickets</p>
          </div>
        ) : (
          <>
            {/* Tabla - Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-pink-300 text-black">
                  <tr>
                    <th className="text-left px-6 py-3">#</th>
                    <th className="text-left px-6 py-3">Asunto</th>
                    <th className="text-left px-6 py-3">Cliente</th>
                    <th className="text-left px-6 py-3">Agente</th>
                    <th className="text-left px-6 py-3">Estado</th>
                    <th className="text-left px-6 py-3">Mensajes</th>
                    <th className="text-left px-6 py-3">Fecha</th>
                    <th className="text-center px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((t) => (
                    <tr key={t.id_ticket} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">#{t.id_ticket}</td>
                      <td className="px-6 py-4">{t.asunto}</td>
                      <td className="px-6 py-4">{t.cliente_nombre}</td>
                      <td className="px-6 py-4">
                        {t.agente_nombre || (
                          <span className="text-gray-400 italic">No asignado</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <TicketEstadoBadge estado={t.estado} />
                      </td>
                      <td className="px-6 py-4 text-center">{t.cantidad_mensajes}</td>
                      <td className="px-6 py-4">
                        {new Date(t.fecha_creacion).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          label="Ver Detalle"
                          color="primary"
                          onClick={() => handleVerTicket(t.id_ticket)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-4">
              {tickets.map((t) => (
                <div key={t.id_ticket} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">#{t.id_ticket}</span>
                    <TicketEstadoBadge estado={t.estado} />
                  </div>
                  <p className="font-medium text-gray-800 mb-1">{t.asunto}</p>
                  <p className="text-sm text-gray-600">Cliente: {t.cliente_nombre}</p>
                  <p className="text-sm text-gray-600">Agente: {t.agente_nombre || "Sin asignar"}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Fecha: {new Date(t.fecha_creacion).toLocaleDateString("es-ES")}
                  </p>
                  <div className="mt-3 text-right">
                    <Button
                      label="Ver Detalle"
                      color="primary"
                      onClick={() => handleVerTicket(t.id_ticket)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-sm text-gray-600">
                  Mostrando {(paginaActual - 1) * pageSize + 1} -{" "}
                  {Math.min(paginaActual * pageSize, totalTickets)} de {totalTickets}
                </p>
                <div className="flex gap-2">
                  <Button
                    label="← Anterior"
                    color="info"
                    onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                    disabled={paginaActual === 1}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Página {paginaActual} de {totalPaginas}
                  </span>
                  <Button
                    label="Siguiente →"
                    color="info"
                    onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
                    disabled={paginaActual === totalPaginas}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
