import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModuleLayout from "../../layouts/ModuleLayout";
import Button from "../../components/ui/Button";
import ModalDirecciones from "../../components/usuario/ModalDirecciones";
import { UsuarioService, type Usuario } from "../../services/usuarios/gestionUsuario";
import type { Direccion } from "../../services/direcciones/direccionesService";
import { obtenerDirecciones } from "../../services/direcciones/direccionesService";

interface Compra {
  id_compra: number;
  fecha_compra: string;
  total: number;
  estado: string;
}

export default function GestionarCuentaCliente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState<Usuario | null>(null);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalDirecciones, setModalDirecciones] = useState(false);

  useEffect(() => {
    console.log("ID del parámetro URL:", id);
    
    if (!id) {
      setError("No se proporcionó ID de cliente");
      setLoading(false);
      return;
    }
    
    const idNumerico = parseInt(id);
    if (isNaN(idNumerico)) {
      setError("ID de cliente inválido");
      setLoading(false);
      return;
    }
    
    cargarDatosCliente(idNumerico);
  }, [id]);

  const cargarDatosCliente = async (idCliente: number) => {
    setLoading(true);
    setError(null);
    
    console.log("🔍 Iniciando carga de cliente ID:", idCliente);

    try {
      // Cargar datos del cliente usando el servicio
      console.log("📞 Llamando a UsuarioService.obtener...");
      const responseCliente = await UsuarioService.obtener(idCliente);
      console.log("✅ Respuesta recibida:", responseCliente);
      console.log("📦 Data del cliente:", responseCliente.data);
      
      // Verificar que sea un cliente
      if (responseCliente.data && responseCliente.data.rol !== 'CLIENTE') {
        setError("Este usuario no es un cliente");
        setLoading(false);
        return;
      }
      
      // La respuesta viene directamente en responseCliente.data
      if (responseCliente.data) {
        console.log("✅ Cliente establecido:", responseCliente.data);
        setCliente(responseCliente.data);
      } else {
        console.error("❌ No hay datos en la respuesta");
        setError("Cliente no encontrado");
        setLoading(false);
        return;
      }

      // Cargar direcciones
      console.log("📍 Cargando direcciones...");
      const dataDirecciones = await obtenerDirecciones(idCliente);
      console.log("📍 Respuesta direcciones:", dataDirecciones);
      
      if (dataDirecciones.success) {
        setDirecciones(dataDirecciones.direcciones || []);
        console.log("✅ Direcciones cargadas:", dataDirecciones.direcciones?.length || 0);
      }

      // Placeholder para compras
      setCompras([]);
      console.log("✅ Carga completada exitosamente");
      
    } catch (err: any) {
      console.error("❌ Error al cargar datos del cliente:", err);
      console.error("📄 Respuesta completa:", err.response);
      console.error("📄 Data del error:", err.response?.data);
      console.error("📄 Status:", err.response?.status);
      
      // Mostrar mensaje de error más específico
      if (err.response?.status === 404) {
        setError("Cliente no encontrado");
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para ver este cliente");
      } else {
        setError(err.response?.data?.message || "Error al cargar los datos del cliente");
      }
    } finally {
      setLoading(false);
      console.log("🏁 Carga finalizada - loading:", false);
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Gestión de Cuenta del Cliente">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos del cliente...</p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (error || !cliente) {
    return (
      <ModuleLayout title="Gestión de Cuenta del Cliente">
        <div className="text-center py-12">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Cliente no encontrado"}</p>
          <Button label="Volver a Usuarios" color="info" onClick={() => navigate("/dashboard/usuarios")} />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title={`Cuenta de ${cliente.nombre_completo}`}>
      <div className="mb-6">
        <Button label="← Volver a Usuarios" color="info" onClick={() => navigate("/dashboard/usuarios")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Perfil del Cliente</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${cliente.estado_usuario === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {cliente.estado_usuario}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-medium text-gray-900">{cliente.nombre_completo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuario</p>
                <p className="font-medium text-gray-900">@{cliente.nombre_usuario}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Correo Electrónico</p>
                <p className="font-medium text-gray-900">{cliente.correo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-900">{cliente.telefono || "No registrado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Registro</p>
                <p className="font-medium text-gray-900">
                  {new Date(cliente.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Último Login</p>
                <p className="font-medium text-gray-900">
                  {cliente.ultimo_login 
                    ? new Date(cliente.ultimo_login).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Nunca'
                  }
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Direcciones ({direcciones.length})</h2>
              <Button label="📍 Gestionar Direcciones" color="success" onClick={() => setModalDirecciones(true)} />
            </div>
            {direcciones.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-gray-400 text-4xl mb-2">📭</div>
                <p className="text-gray-600">No hay direcciones registradas</p>
                <button
                  onClick={() => setModalDirecciones(true)}
                  className="mt-3 text-pink-600 hover:text-pink-700 font-medium text-sm underline"
                >
                  Agregar primera dirección
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {direcciones.map((direccion) => (
                  <div key={direccion.id_direccion} className={`p-3 rounded-lg border-2 ${direccion.es_principal ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900">{direccion.etiqueta || "Sin etiqueta"}</span>
                      {direccion.es_principal && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold">
                          ⭐ Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{direccion.direccion}</p>
                    {(direccion.ciudad || direccion.departamento || direccion.pais) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {[direccion.ciudad, direccion.departamento, direccion.pais]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Compras</h2>
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-4xl mb-2">🛍️</div>
              <p className="text-gray-600">Sin compras realizadas</p>
              <p className="text-sm text-gray-500 mt-1">El historial de compras se implementará próximamente</p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  <span className="text-sm text-gray-600">Direcciones</span>
                </div>
                <span className="text-2xl font-bold text-pink-600">{direcciones.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-sm text-gray-600">Compras</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{compras.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {modalDirecciones && (
        <ModalDirecciones
          show={modalDirecciones}
          usuario={cliente}
          onCancel={() => {
            setModalDirecciones(false);
            if (id) cargarDatosCliente(parseInt(id));
          }}
        />
      )}
    </ModuleLayout>
  );
}
