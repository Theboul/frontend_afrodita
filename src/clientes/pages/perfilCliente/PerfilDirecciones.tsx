import { useEffect, useState } from "react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { 
  direccionesClienteService, 
  type Direccion,
  type CrearDireccionData
} from "../../../services/cliente/direccionesClienteService";
import toast from "react-hot-toast";
import { MapPin, Star, Trash2, Edit, X } from "lucide-react";
import FormularioDireccionCliente from "../../../clientes/components/direcciones/FormularioDireccionCliente";

export default function PerfilDirecciones() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Direccion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const cargarDirecciones = async () => {
    setLoading(true);
    try {
      console.log("🏠 Cargando direcciones del cliente...");
      const res = await direccionesClienteService.listarMisDirecciones();
      console.log("🏠 Respuesta completa:", res);
      console.log("🏠 res.data:", res.data);
      
      if (res.success && res.data?.direcciones) {
        console.log("✅ Direcciones encontradas:", res.data.direcciones);
        setDirecciones(res.data.direcciones);
      } else {
        console.log("⚠️ No hay direcciones o respuesta incorrecta");
        setDirecciones([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar direcciones:", error);
      toast.error("Error al cargar direcciones");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarPrincipal = async (id: number) => {
    try {
      const res = await direccionesClienteService.marcarPrincipal(id);
      if (res.success) {
        toast.success("Dirección marcada como principal ✅");
        await cargarDirecciones();
      }
    } catch (error) {
      toast.error("Error al marcar como principal");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;
    
    try {
      const res = await direccionesClienteService.eliminarDireccion(id);
      if (res.success) {
        toast.success("Dirección eliminada ✅");
        await cargarDirecciones();
      }
    } catch (error) {
      toast.error("Error al eliminar dirección");
    }
  };

  const handleAbrirFormulario = (direccion?: Direccion) => {
    setEditando(direccion || null);
    setModalVisible(true);
  };

  const handleCerrarFormulario = () => {
    setModalVisible(false);
    setEditando(null);
  };

  const handleSubmitDireccion = async (datos: CrearDireccionData) => {
    setSubmitting(true);
    try {
      let res;
      
      if (editando) {
        // Actualizar dirección existente
        res = await direccionesClienteService.actualizarDireccion(editando.id_direccion, datos);
      } else {
        // Crear nueva dirección
        console.log("📝 Creando nueva dirección:", datos);
        res = await direccionesClienteService.crearDireccion(datos);
        console.log("📝 Respuesta crear:", res);
      }

      if (res.success) {
        toast.success(editando ? "Dirección actualizada ✅" : "Dirección creada ✅");
        handleCerrarFormulario();
        await cargarDirecciones();
      } else {
        toast.error(res.message || "Error al guardar la dirección");
      }
    } catch (error: any) {
      console.error("❌ Error al guardar dirección:", error);
      toast.error(error.response?.data?.message || "Error al guardar la dirección");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Cargando direcciones...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Mis Direcciones</h2>
        <Button 
          label="Agregar Dirección" 
          color="primary"
          onClick={() => handleAbrirFormulario()}
        />
      </div>

      {direcciones.length === 0 ? (
        <EmptyState
          title="No tienes direcciones registradas"
          description="Agrega una dirección para tus próximas compras."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {direcciones.map((direccion) => (
            <Card key={direccion.id_direccion}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-pink-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{direccion.etiqueta || "Sin etiqueta"}</h3>
                      {direccion.es_principal && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" />
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{direccion.direccion}</p>
                    <p className="text-sm text-gray-600">
                      {direccion.ciudad && `${direccion.ciudad}, `}
                      {direccion.departamento}
                    </p>
                    {direccion.pais && (
                      <p className="text-sm text-gray-500">{direccion.pais}</p>
                    )}
                    {direccion.referencia && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        Ref: {direccion.referencia}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                {!direccion.es_principal && (
                  <Button
                    label="Marcar como principal"
                    color="info"
                    onClick={() => handleMarcarPrincipal(direccion.id_direccion)}
                  />
                )}
                <button
                  onClick={() => handleAbrirFormulario(direccion)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEliminar(direccion.id_direccion)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal crear/editar dirección */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editando ? "Editar Dirección" : "Agregar Dirección"}
              </h3>
              <button
                onClick={handleCerrarFormulario}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <FormularioDireccionCliente
                direccion={editando}
                onSubmit={handleSubmitDireccion}
                onCancel={handleCerrarFormulario}
                loading={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
