import { useEffect, useState } from "react";
import { axiosInstance } from "../../services/axiosConfig";

export default function EnviosVendedor() {
const [envios, setEnvios] = useState<any[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [openVenta, setOpenVenta] = useState<number | null>(null);


  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/api/envios/envios-detallados/");
        setEnvios(res.data.envios);
      } catch (err) {
        console.error("Error cargando envíos:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">
        Gestión de Envíos
      </h1>

      <div className="space-y-6">
        {envios.map((envio) => (
          <div
            key={envio.cod_envio}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Envío #{envio.cod_envio}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 md:mt-0 ${
                  envio.estado_envio === "EN_PREPARACION"
                    ? "bg-yellow-100 text-yellow-700"
                    : envio.estado_envio === "EN_CAMINO"
                    ? "bg-blue-100 text-blue-700"
                    : envio.estado_envio === "ENTREGADO"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {envio.estado_envio.replace("_", " ")}
              </span>
            </div>

            {/* DETALLES DEL ENVÍO */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <p><b>Fecha del envío:</b> {envio.fecha_envio}</p>
              <p><b>Tipo de envío:</b> {envio.tipo_envio}</p>
              <p><b>Costo:</b> Bs {envio.costo ?? "0.00"}</p>
            </div>

            {/* DATOS DEL CLIENTE */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-gray-800 mb-2">Datos del Cliente</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                <p><b>ID Cliente:</b> {envio.direccion.cliente_id}</p>
                <p><b>Nombre:</b> {envio.direccion.cliente_nombre}</p>
                <p><b>Correo:</b> {envio.direccion.cliente_correo}</p>
                <p><b>Teléfono:</b> {envio.direccion.cliente_telefono}</p>
              </div>
            </div>

            {/* DATOS DE LA DIRECCIÓN */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-gray-800 mb-2">Dirección de Envío</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                <p><b>Etiqueta:</b> {envio.direccion.etiqueta}</p>
                <p><b>Dirección:</b> {envio.direccion.direccion}</p>
                <p><b>Ciudad:</b> {envio.direccion.ciudad}</p>
                <p><b>Departamento:</b> {envio.direccion.departamento}</p>
                <p><b>País:</b> {envio.direccion.pais ?? "Bolivia"}</p>
                <p><b>Referencia:</b> {envio.direccion.referencia || "Sin referencia"}</p>
              </div>
            </div>

            {/* VENTAS */}
            <div className="mt-4 bg-gray-50 rounded-lg border p-4">
              <button
                className="w-full flex justify-between items-center text-left hover:text-purple-700"
                onClick={() =>
                  setOpenVenta(openVenta === envio.cod_envio ? null : envio.cod_envio)
                }
              >
                <h3 className="font-bold text-gray-800">Ventas Asociadas</h3>
                <span className="text-purple-600 font-bold text-xl">
                  {openVenta === envio.cod_envio ? "▲" : "▼"}
                </span>
              </button>

              {openVenta === envio.cod_envio && (
                <div className="mt-3 animate-fadeIn">
                  {envio.ventas.length === 0 ? (
                    <p className="text-gray-500">No tiene ventas registradas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {envio.ventas.map((v: any) => (
                        <li
                          key={v.id_venta}
                          className="p-3 bg-white rounded-lg shadow-sm border flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold">
                              Venta #{v.id_venta} — Bs {v.monto_total}
                            </p>
                            <p className="text-sm text-gray-500">{v.fecha}</p>
                          </div>

                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              v.estado === "PENDIENTE"
                                ? "bg-yellow-100 text-yellow-700"
                                : v.estado === "COMPLETADO"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {v.estado}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
