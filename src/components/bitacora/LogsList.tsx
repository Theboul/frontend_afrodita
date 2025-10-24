import { type Bitacora } from '../../services/bitacora/bitacoraService';

interface LogsListProps {
  logs: Bitacora[];
  loading: boolean;
}

export default function LogsList({ logs, loading }: LogsListProps) {
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFechaCorta = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vista mobile (cards)
  const MobileView = () => (
    <div className="space-y-3 sm:hidden p-3 sm:p-4">
      {logs.map((log) => (
        <div 
          key={log.id_bitacora} 
          className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header de la card */}
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <span className="inline-block font-semibold text-purple-700 text-xs sm:text-sm bg-purple-50 px-2 py-1 rounded truncate max-w-full">
                {log.accion_display}
              </span>
            </div>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 flex-shrink-0">
              {log.ip}
            </code>
          </div>

          {/* Descripción */}
          <p className="text-xs sm:text-sm text-gray-800 mb-3 line-clamp-3 leading-relaxed break-words">
            {log.descripcion}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-2 gap-2">
            <div className="flex items-center min-w-0 flex-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate">{log.usuario}</span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatFechaCorta(log.fecha_hora)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Vista desktop (tabla)
  const DesktopView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Fecha y Hora
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Acción
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px] lg:min-w-[300px]">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              IP
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Usuario
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr 
              key={log.id_bitacora} 
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex flex-col">
                  <span className="font-medium">{formatFecha(log.fecha_hora)}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="inline-flex font-semibold text-purple-700 text-sm bg-purple-50 px-2 py-1 rounded">
                  {log.accion_display}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 max-w-[300px] 2xl:max-w-[400px]">
                <div 
                  className="truncate hover:whitespace-normal hover:break-words cursor-help" 
                  title={log.descripcion}
                >
                  {log.descripcion}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                  {log.ip}
                </code>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {log.usuario}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Estados de carga y vacío
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-base sm:text-lg">Cargando registros...</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center px-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-base sm:text-lg">No se encontraron registros</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            No hay actividad registrada con los filtros actuales
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}