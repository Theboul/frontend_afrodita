import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ModuleLayout from "../../layouts/ModuleLayout";
import Modal from "../../components/ui/Modal";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import RolForm from "../../components/seguridad/RolForm";
import RolTable from "../../components/seguridad/RolTable";
import RolCard from "../../components/seguridad/RolCard";
import UsuariosRolModal from "../../components/seguridad/UsuariosRolModal";
import PermisosRolModal from "../../components/seguridad/PermisosRolModal";
import { useRoles } from "../../hooks/useRoles";
import { seguridadService, type Permiso } from "../../services/seguridad/seguridadService";

export default function GestionRoles() {
  const { roles, loading, cargarRoles, crearRol, actualizarRol, eliminarRol } = useRoles();
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarPermisos, setMostrarPermisos] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<{ id: number; nombre: string } | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rolEditando, setRolEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    descripcion: "", 
    permisos_ids: [] as number[]
  });

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const response = await seguridadService.obtenerPermisos({ activo: true });
        if (response.success) setPermisos(response.data);
      } catch (error) {
        toast.error("Error al cargar permisos");
      }
    };
    cargarPermisos();
  }, []);

  const handleNuevo = () => {
    setFormData({ nombre: "", descripcion: "", permisos_ids: [] });
    setModoEdicion(false);
    setRolEditando(null);
    setMostrarModal(true);
  };

  const handleEditar = async (id: number) => {
    try {
      const response = await seguridadService.obtenerRol(id);
      
      if (response.success) {
        setFormData({
          nombre: response.data.nombre,
          descripcion: response.data.descripcion || "",
          permisos_ids: response.data.permisos?.map((p) => p.id_permiso) || [],
        });
        setRolEditando(id);
        setModoEdicion(true);
        setMostrarModal(true);
      } else {
        toast.error(response.message || "Error al cargar el rol");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al cargar el rol");
    }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el rol "${nombre}"?`)) {
      await eliminarRol(id);
    }
  };

  const handleVerUsuarios = (id: number, nombre: string) => {
    setRolSeleccionado({ id, nombre });
    setMostrarUsuarios(true);
  };

  const handleVerPermisos = (id: number, nombre: string) => {
    setRolSeleccionado({ id, nombre });
    setMostrarPermisos(true);
  };

  const handleSubmit = async (data: typeof formData) => {
    const exito = modoEdicion && rolEditando
      ? await actualizarRol(rolEditando, data)
      : await crearRol(data);

    if (exito) setMostrarModal(false);
  };

  const rolesFiltrados = roles.filter(
    (r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <ModuleLayout title="Gestión de Roles">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar roles..." />
        <Button label="Nuevo Rol" color="info" onClick={handleNuevo} />
      </div>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={modoEdicion ? "Editar Rol" : "Nuevo Rol"}
        maxWidth="xl"
      >
        <RolForm
          initialData={formData}
          permisos={permisos}
          onSubmit={handleSubmit}
          onCancel={() => setMostrarModal(false)}
          isEdit={modoEdicion}
        />
      </Modal>

      {rolSeleccionado && (
        <>
          <UsuariosRolModal
            isOpen={mostrarUsuarios}
            onClose={() => setMostrarUsuarios(false)}
            rolId={rolSeleccionado.id}
            rolNombre={rolSeleccionado.nombre}
          />
          
          <PermisosRolModal
            isOpen={mostrarPermisos}
            onClose={() => setMostrarPermisos(false)}
            rolId={rolSeleccionado.id}
            rolNombre={rolSeleccionado.nombre}
          />
        </>
      )}

      {loading ? (
        <Loading message="Cargando roles..." />
      ) : rolesFiltrados.length === 0 ? (
        <EmptyState message="No se encontraron roles" />
      ) : (
        <>
          <div className="hidden md:block">
            <RolTable 
              roles={rolesFiltrados} 
              onEdit={handleEditar} 
              onDelete={handleEliminar}
              onVerUsuarios={handleVerUsuarios}
              onVerPermisos={handleVerPermisos}
            />
          </div>
          <div className="md:hidden space-y-4">
            {rolesFiltrados.map((rol) => (
              <RolCard 
                key={rol.id_rol} 
                rol={rol} 
                onEdit={handleEditar} 
                onDelete={handleEliminar}
                onVerUsuarios={handleVerUsuarios}
                onVerPermisos={handleVerPermisos}
              />
            ))}
          </div>
        </>
      )}
    </ModuleLayout>
  );
}