import { type EstadisticasBitacora } from '../../services/bitacora/bitacoraService';

interface EstadisticasPanelProps {
  estadisticas: EstadisticasBitacora | null;
  loading: boolean;
}

export default function EstadisticasPanel({ estadisticas, loading }: EstadisticasPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!estadisticas) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Estadísticas - {estadisticas.periodo}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de eventos */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <span className="text-blue-600 text-lg">📈</span>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Eventos</p>
              <p className="text-2xl font-bold text-blue-700">{estadisticas.total_eventos}</p>
            </div>
          </div>
        </div>

        {/* Usuarios registrados */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <span className="text-green-600 text-lg">👥</span>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Usuarios Activos</p>
              <p className="text-2xl font-bold text-green-700">{estadisticas.distribucion_usuarios.registrados}</p>
            </div>
          </div>
        </div>

        {/* Anónimos */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <span className="text-yellow-600 text-lg">👤</span>
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Anónimos</p>
              <p className="text-2xl font-bold text-yellow-700">{estadisticas.distribucion_usuarios.anonimos}</p>
            </div>
          </div>
        </div>

        {/* Porcentaje anónimos */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <span className="text-purple-600 text-lg">%</span>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">% Anónimos</p>
              <p className="text-2xl font-bold text-purple-700">
                {estadisticas.distribucion_usuarios.porcentaje_anonimos}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Acciones Más Comunes</h4>
          <div className="space-y-2">
            {estadisticas.estadisticas_por_accion.slice(0, 5).map((stat) => (
              <div key={stat.accion} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{stat.accion}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {stat.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Usuarios Más Activos</h4>
          <div className="space-y-2">
            {estadisticas.usuarios_mas_activos.slice(0, 5).map((user) => (
              <div key={user.id_usuario__nombre_usuario} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{user.id_usuario__nombre_usuario}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {user.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}