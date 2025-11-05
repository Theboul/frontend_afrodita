import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ModuleLayout from "../../layouts/ModuleLayout";
import Modal from "../../components/ui/Modal";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import PermisoForm from "../../components/seguridad/PermisoForm";
import PermisoTable from "../../components/seguridad/PermisoTable";
import PermisoCard from "../../components/seguridad/PermisoCard";
import { seguridadService, type Permiso } from "../../services/seguridad/seguridadService";

export default function GestionPermisos() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [permisoEditando, setPermisoEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    modulo: "",
    activo: true,
  });

  const modulos = Array.from(new Set(permisos.map((p) => p.modulo))).sort();

  const cargarPermisos = async () => {
    setLoading(true);
    try {
      const response = await seguridadService.obtenerPermisos();
      if (response.success) setPermisos(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  const handleNuevo = () => {
    setFormData({ nombre: "", codigo: "", descripcion: "", modulo: "", activo: true });
    setModoEdicion(false);
    setPermisoEditando(null);
    setMostrarModal(true);
  };

  const handleEditar = (permiso: Permiso) => {
    setFormData({
      nombre: permiso.nombre,
      codigo: permiso.codigo,
      descripcion: permiso.descripcion || "",
      modulo: permiso.modulo,
      activo: permiso.activo,
    });
    setPermisoEditando(permiso.id_permiso);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el permiso "${nombre}"?`)) {
      setLoading(true);
      try {
        const response = await seguridadService.eliminarPermiso(id);
        if (response.success) {
          toast.success(response.message);
          await cargarPermisos();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error al eliminar permiso");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    setLoading(true);
    try {
      if (modoEdicion && permisoEditando) {
        const response = await seguridadService.actualizarPermiso(permisoEditando, data);
        if (response.success) {
          toast.success(response.message);
          await cargarPermisos();
          setMostrarModal(false);
        }
      } else {
        const response = await seguridadService.crearPermiso(data);
        if (response.success) {
          toast.success(response.message);
          await cargarPermisos();
          setMostrarModal(false);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al guardar permiso");
    } finally {
      setLoading(false);
    }
  };

  const permisosFiltrados = permisos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideModulo = !filtroModulo || p.modulo === filtroModulo;
    return coincideBusqueda && coincideModulo;
  });

  return (
    <ModuleLayout title="Gestión de Permisos">
      <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar permisos..." />
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:outline-none text-sm"
          >
            <option value="">Todos los módulos</option>
            {modulos.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>
        <Button label="Nuevo Permiso" color="info" onClick={handleNuevo} />
      </div>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={modoEdicion ? "Editar Permiso" : "Nuevo Permiso"}
      >
        <PermisoForm
          initialData={formData}
          modulos={modulos}
          onSubmit={handleSubmit}
          onCancel={() => setMostrarModal(false)}
          isEdit={modoEdicion}
        />
      </Modal>

      {loading ? (
        <Loading message="Cargando permisos..." />
      ) : permisosFiltrados.length === 0 ? (
        <EmptyState message="No se encontraron permisos" />
      ) : (
        <>
          <div className="hidden md:block">
            <PermisoTable permisos={permisosFiltrados} onEdit={handleEditar} onDelete={handleEliminar} />
          </div>
          <div className="md:hidden space-y-4">
            {permisosFiltrados.map((permiso) => (
              <PermisoCard
                key={permiso.id_permiso}
                permiso={permiso}
                onEdit={handleEditar}
                onDelete={handleEliminar}
              />
            ))}
          </div>
        </>
      )}
    </ModuleLayout>
  );
}