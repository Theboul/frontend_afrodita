import { useEffect, useState } from "react";
import { ventasService } from "../../services/ventas/ventasService";
import LoadingFallback from "../../components/common/LoadingFallback";
import { Link } from "react-router-dom";
import VentaPresencialForm from "../../components/ventas/VentaPresencialForm";

export default function GestionarVentas() {
  // El estado 'ventas' ahora solo almacenará el array de items
  const [ventas, setVentas] = useState<any[]>([]);
  
  // Nuevo estado para almacenar la información de paginación
  const [pagination, setPagination] = useState<any>(null);
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalVentaPresencial, setModalVentaPresencial] = useState(false);

  useEffect(() => {
    // Recargamos las ventas cuando cambie la página actual
    cargarVentas(currentPage);
  }, [currentPage]);

  const cargarVentas = (page: number) => {
    setLoading(true);
    ventasService
      .listarVentas(page) // Asumimos que el servicio puede recibir la página
      .then((res) => {
        // La respuesta paginada de Django es { count, next, previous, results }
        const pageSize = 15; // El mismo valor que en el backend
        const totalPages = Math.ceil(res.data.count / pageSize);

        // Asignamos el array de ventas que viene en la propiedad 'results'
        setVentas(res.data.results); 
        // Guardamos la información de paginación relevante
        setPagination({
          totalPages: totalPages,
          next: res.data.next,
          previous: res.data.previous
        });
      })
      .finally(() => setLoading(false));
  };

  //const abrirModal = (venta: any) => {
  //  setVentaSeleccionada(venta);
  //  setModalOpen(true);
  //};

  const cerrarModal = () => {
    setModalOpen(false);
    setVentaSeleccionada(null);
  };

  const abrirModalVentaPresencial = () => {
    setModalVentaPresencial(true);
  };

  const cerrarModalVentaPresencial = () => {
    setModalVentaPresencial(false);
  };

  const anularVenta = async (id: number) => {
    if (!confirm("¿Seguro que deseas anular esta venta?")) return;

    await ventasService.anularVenta(id);
    cargarVentas(currentPage);
    cerrarModal();
  };

  const confirmarPago = async (id: number) => {
    if (!confirm("¿Confirmar el pago de esta venta?")) return;
    await ventasService.confirmarPago(id);
    cargarVentas(currentPage);
  };

  if (loading) return <LoadingFallback />;

  return (
    <div className="p-6">

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">
          Gestionar Ventas
        </h1>

        <button
          onClick={abrirModalVentaPresencial}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
        >
          + Registrar Venta Presencial
        </button>
      </div>

      {/* Tabla RESPONSIVE */}
      <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="w-full text-left min-w-[750px]">
          <thead className="bg-pink-200 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Vendedor</th>
              <th className="p-3">Método Pago</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((venta: any) => (
              <tr key={venta.id_venta} className="border-t hover:bg-pink-50 transition">
                <td className="p-3">{venta.id_venta}</td>
                <td className="p-3">{venta.cliente_nombre}</td>
                <td className="p-3">{venta.vendedor_nombre}</td>
                <td className="p-3">{venta.metodo_pago_tipo}</td>
                <td className="p-3 font-semibold">Bs {venta.monto_total}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      venta.estado === "ANULADA"
                        ? "bg-red-500"
                        : venta.estado === "PENDIENTE"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                  >
                    {venta.estado}
                  </span>
                </td>

                <td className="p-3 space-x-2 text-center">
                  
                  {venta.estado === "PENDIENTE" && (
                    <button
                      onClick={() => confirmarPago(venta.id_venta)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirmar Pago
                    </button>
                  )}

                  {venta.estado === "COMPLETADO" && (
                    <Link
                      to={`/venta/nota/${venta.id_venta}`}
                      className="px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Ver Nota
                    </Link>
                  )}

                  <button
                    onClick={() => anularVenta(venta.id_venta)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Anular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.previous} // Deshabilitado si no hay página anterior
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="text-gray-700">
            Página {currentPage} de {pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!pagination.next} // Deshabilitado si no hay página siguiente
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* MODAL DE VENTA PRESENCIAL */}
      {modalVentaPresencial && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-3xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pink-600">Registrar Venta Presencial</h2>
              <button onClick={cerrarModalVentaPresencial} className="text-gray-600 hover:text-black">
                ✕
              </button>
            </div>

            <VentaPresencialForm
              onClose={cerrarModalVentaPresencial}
              onSuccess={() => {
                cerrarModalVentaPresencial();
                cargarVentas(1); // Volver a la página 1 al crear una nueva venta
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL DE VISTA RÁPIDA */}
      {modalOpen && ventaSeleccionada && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-xl p-6 rounded-xl shadow-xl animate-fade-in">

            <h2 className="text-xl font-bold text-pink-600 mb-4">Nota de Venta</h2>

            <p><span className="font-semibold">Cliente:</span> {ventaSeleccionada.cliente_nombre}</p>
            <p><span className="font-semibold">Vendedor:</span> {ventaSeleccionada.vendedor_nombre}</p>
            <p><span className="font-semibold">Total:</span> Bs {ventaSeleccionada.monto_total}</p>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              <span className="px-3 py-1 rounded-full text-white text-sm bg-pink-500">
                {ventaSeleccionada.estado}
              </span>
            </p>

            <div className="mt-6 flex justify-between">
              <Link
                to={`/venta/nota/${ventaSeleccionada.id_venta}`}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Ver Completa
              </Link>

              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
