import { useEffect, useState } from "react";
import { getBitacoraLogs } from '../../services/bitacora/bitacoraService';


interface Bitacora {
  id_bitacora: number;
  fecha_hora: string;
  accion: string;
  descripcion: string;
  ip: string;
  usuario: string;
}

export default function BitacoraPage() {
  const [logs, setLogs] = useState<Bitacora[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBitacoraLogs()
      .then((data) => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 animate-slide-down">
      <header className="page-header rounded-md">
        <h1 className="text-2xl font-bold">Bitácora del Sistema</h1>
      </header>

      <section className="section-base mt-6">
        <h2 className="text-lg mb-4 font-semibold">Últimos 50 movimientos registrados</h2>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Cargando registros...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No hay movimientos registrados.</div>
        ) : (
          <div className="table-wrapper overflow-x-auto max-h-[600px] overflow-y-auto">
            <table>
              <thead className="table-header">
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Acción</th>
                  <th>Descripción</th>
                  <th>IP</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id_bitacora} className="table-row">
                    <td>{new Date(log.fecha_hora).toLocaleString()}</td>
                    <td className="font-semibold text-purple-700">{log.accion}</td>
                    <td>{log.descripcion}</td>
                    <td>{log.ip}</td>
                    <td>{log.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
