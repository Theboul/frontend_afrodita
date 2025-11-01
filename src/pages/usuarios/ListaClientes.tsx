import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModuleLayout from "../../layouts/ModuleLayout";
import Button from "../../components/ui/Button";
import { UsuarioService, type Usuario } from "../../services/usuarios/gestionUsuario";

export default function ListaClientes() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const pageSize = 10;
  
  // Búsqueda
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarClientes();
  }, [paginaActual, busqueda]);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const parametros = {
        rol: 'CLIENTE',
        search: busqueda || undefined,
        page: paginaActual,
        pageSize: pageSize
      };
      
      console.log("🔍 Parámetros enviados al backend:", parametros);
      
      const response = await UsuarioService.listar(parametros);

      console.log("📦 Respuesta completa:", response);
      console.log("📦 Datos recibidos:", response.data);
      console.log("📦 Total usuarios recibidos:", response.data?.results?.length);

      if (response.data) {
        // FILTRO DE SEGURIDAD: Solo mostrar usuarios con rol CLIENTE
        const todosLosResultados = response.data.results || [];
        const soloClientes = todosLosResultados.filter((usuario: Usuario) => usuario.rol === 'CLIENTE');
        
        console.log("✅ Total después de filtrar:", soloClientes.length);
        console.log("✅ Usuarios filtrados:", soloClientes.map((u: Usuario) => `${u.nombre_completo} (${u.rol})`));

        setClientes(soloClientes);
        setTotalClientes(soloClientes.length);
        setTotalPaginas(Math.ceil(soloClientes.length / pageSize));
      }
    } catch (err: any) {
      console.error("❌ Error al cargar clientes:", err);
      setError("Error al cargar la lista de clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (cliente: Usuario) => {
    navigate(`/dashboard/clientes/${cliente.id_usuario}`);
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(1);
    cargarClientes();
  };

  return (
    <ModuleLayout title="Gestión de Clientes">
      <div className="space-y-6">
        {/* Header con búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Total de Clientes: {totalClientes}
                </h2>
                <p className="text-sm text-gray-500">
                  Página {paginaActual} de {totalPaginas}
                </p>
              </div>
            </div>

            <form onSubmit={handleBuscar} className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar por nombre, email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                🔍
              </button>
            </form>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : clientes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron clientes
            </h3>
            <p className="text-gray-500">
              {busqueda ? "Intenta con otros términos de búsqueda" : "Aún no hay clientes registrados"}
            </p>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-pink-300 text-black">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Contacto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Registro</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Último Login</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id_usuario} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {cliente.nombre_completo.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {cliente.nombre_completo}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{cliente.nombre_usuario}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{cliente.correo}</div>
                        {cliente.telefono && (
                          <div className="text-sm text-gray-500">📱 {cliente.telefono}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cliente.estado_usuario === 'ACTIVO' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cliente.estado_usuario === 'ACTIVO' ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(cliente.fecha_registro).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cliente.ultimo_login 
                          ? new Date(cliente.ultimo_login).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Nunca'
                        }
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button 
                          label="Ver Detalles" 
                          color="primary" 
                          onClick={() => handleVerDetalle(cliente)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-4">
              {clientes.map((cliente) => (
                <div key={cliente.id_usuario} className="bg-white rounded-lg shadow-md p-4">
                  {/* Header del card */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {cliente.nombre_completo.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {cliente.nombre_completo}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        @{cliente.nombre_usuario}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        cliente.estado_usuario === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.estado_usuario === 'ACTIVO' ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-2 mb-3 pb-3 border-b">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📧</span>
                      <span className="truncate">{cliente.correo}</span>
                    </div>
                    {cliente.telefono && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📱</span>
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>Registro: {new Date(cliente.fecha_registro).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🕐</span>
                      <span>
                        Último login: {cliente.ultimo_login 
                          ? new Date(cliente.ultimo_login).toLocaleDateString('es-ES')
                          : 'Nunca'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <Button 
                    label="Ver Detalles Completos" 
                    color="primary" 
                    onClick={() => handleVerDetalle(cliente)}
                  />
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {((paginaActual - 1) * pageSize) + 1} - {Math.min(paginaActual * pageSize, totalClientes)} de {totalClientes} clientes
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      label="← Anterior"
                      color="info"
                      onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                      disabled={paginaActual === 1}
                    />
                    
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-sm font-medium text-gray-700">
                        Página {paginaActual} de {totalPaginas}
                      </span>
                    </div>
                    
                    <Button
                      label="Siguiente →"
                      color="info"
                      onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                      disabled={paginaActual === totalPaginas}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
