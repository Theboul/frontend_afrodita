import { type Usuario } from "../../services/usuarios/gestionUsuario";
import Button from "../ui/Button";

interface TablaUsuariosProps {
  usuarios: Usuario[];
  loading: boolean;
  onEditar: (usuario: Usuario) => void;
  onEliminar: (id: number) => void;
  onCambiarEstado: (usuario: Usuario) => void;
  onCambiarContrasena: (usuario: Usuario) => void;
  onVerDirecciones: (usuario: Usuario) => void;
}

export default function TablaUsuarios({
  usuarios,
  loading,
  onEditar,
  onEliminar,
  onCambiarEstado,
  onCambiarContrasena,
  onVerDirecciones
}: TablaUsuariosProps) {
  
  const getBadgeColor = (rol: string) => {
    switch (rol) {
      case 'ADMINISTRADOR': return 'bg-purple-100 text-purple-800';
      case 'VENDEDOR': return 'bg-blue-100 text-blue-800';
      case 'CLIENTE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron usuarios
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla para pantallas grandes (md y superior) */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-pink-300 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Contacto</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Último Login</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-800 font-medium text-sm">
                        {usuario.nombre_completo.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nombre_completo}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{usuario.nombre_usuario}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm text-gray-900">{usuario.correo}</div>
                  {usuario.telefono && (
                    <div className="text-sm text-gray-500">{usuario.telefono}</div>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(usuario.rol)}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onCambiarEstado(usuario)}
                    className={`w-10 h-5 flex items-center rounded-full px-0.5 transition-colors ${
                      usuario.estado_usuario === 'ACTIVO' 
                        ? 'bg-green-500 justify-end' 
                        : 'bg-red-500 justify-start'
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {usuario.ultimo_login 
                    ? new Date(usuario.ultimo_login).toLocaleDateString()
                    : 'Nunca'
                  }
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button 
                      label="Editar" 
                      color="warning" 
                      onClick={() => onEditar(usuario)}
                    />
                    {usuario.rol === 'CLIENTE' && (
                      <Button 
                        label="Direcciones" 
                        color="success" 
                        onClick={() => onVerDirecciones(usuario)}
                      />
                    )}
                    <Button 
                      label="Contraseña" 
                      color="info" 
                      onClick={() => onCambiarContrasena(usuario)}
                    />
                    <Button 
                      label="Eliminar" 
                      color="danger" 
                      onClick={() => onEliminar(usuario.id_usuario)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móvil (pantallas pequeñas) */}
      <div className="md:hidden space-y-4">
        {usuarios.map((usuario) => (
          <div key={usuario.id_usuario} className="bg-white rounded-lg shadow-md p-4">
            {/* Header de la tarjeta */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">
                    {usuario.nombre_completo.charAt(0)}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {usuario.nombre_completo}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    @{usuario.nombre_usuario}
                  </div>
                </div>
              </div>
              {/* Toggle de estado */}
              <button
                onClick={() => onCambiarEstado(usuario)}
                className={`flex-shrink-0 ml-2 w-10 h-5 flex items-center rounded-full px-0.5 transition-colors ${
                  usuario.estado_usuario === 'ACTIVO' 
                    ? 'bg-green-500 justify-end' 
                    : 'bg-red-500 justify-start'
                }`}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </button>
            </div>

            {/* Información de contacto */}
            <div className="mb-3 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">📧</span>
                <span className="truncate">{usuario.correo}</span>
              </div>
              {usuario.telefono && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">📱</span>
                  <span>{usuario.telefono}</span>
                </div>
              )}
            </div>

            {/* Rol y último login */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(usuario.rol)}`}>
                {usuario.rol}
              </span>
              <span className="text-xs text-gray-500">
                {usuario.ultimo_login 
                  ? `Último login: ${new Date(usuario.ultimo_login).toLocaleDateString()}`
                  : 'Sin login'
                }
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-2">
              <Button 
                label="Editar" 
                color="warning" 
                onClick={() => onEditar(usuario)}
              />
              {usuario.rol === 'CLIENTE' && (
                <Button 
                  label="Direcciones" 
                  color="success" 
                  onClick={() => onVerDirecciones(usuario)}
                />
              )}
              <Button 
                label="Contraseña" 
                color="info" 
                onClick={() => onCambiarContrasena(usuario)}
              />
              <Button 
                label="Eliminar" 
                color="danger" 
                onClick={() => onEliminar(usuario.id_usuario)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}