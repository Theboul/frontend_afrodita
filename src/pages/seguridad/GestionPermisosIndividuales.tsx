import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ModuleLayout from "../../layouts/ModuleLayout";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import PermisosEfectivosModal from "../../components/seguridad/PermisosEfectivosModal";
import { seguridadService, type UsuarioPermiso, type Permiso } from "../../services/seguridad/seguridadService";

export default function GestionPermisosIndividuales() {
  const [permisosIndividuales, setPermisosIndividuales] = useState<UsuarioPermiso[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPermisosEfectivos, setMostrarPermisosEfectivos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    usuario: 0,
    permiso: 0,
    concedido: true,
    motivo: "",
    fecha_expiracion: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar permisos individuales
      const respPermisos = await seguridadService.obtenerPermisosIndividuales();
      if (respPermisos.success) setPermisosIndividuales(respPermisos.data);

      // Cargar lista de permisos disponibles
      const respPermisosDisp = await seguridadService.obtenerPermisos({ activo: true });
      if (respPermisosDisp.success) setPermisos(respPermisosDisp.data);

      // TODO: Cargar usuarios desde tu servicio de usuarios
      // const respUsuarios = await usuariosService.obtenerUsuarios();
      // if (respUsuarios.success) setUsuarios(respUsuarios.data);
    } catch (error: any) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.usuario || !formData.permiso || !formData.motivo.trim()) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      const response = await seguridadService.concederRevocarPermiso(formData);
      if (response.success) {
        toast.success(response.message);
        await cargarDatos();
        setMostrarModal(false);
        resetFormulario();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al asignar permiso");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar esta asignación?")) return;

    setLoading(true);
    try {
      const response = await seguridadService.eliminarPermisoIndividual(id);
      if (response.success) {
        toast.success(response.message);
        await cargarDatos();
      }
    } catch (error: any) {
      toast.error("Error al eliminar asignación");
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setFormData({
      usuario: 0,
      permiso: 0,
      concedido: true,
      motivo: "",
      fecha_expiracion: "",
    });
  };

  const verPermisosEfectivos = (usuario: any) => {
    setUsuarioSeleccionado(usuario);
    setMostrarPermisosEfectivos(true);
  };

  return (
    <ModuleLayout title="Permisos Individuales de Usuarios">
      <div className="mb-6 flex justify-end">
        <Button
          label="Asignar/Revocar Permiso"
          color="info"
          onClick={() => {
            resetFormulario();
            setMostrarModal(true);
          }}
        />
      </div>

      {/* Modal de Formulario */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Asignar/Revocar Permiso Individual"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Usuario *
            </label>
            <select
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: Number(e.target.value) })}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value={0}>Seleccione un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre_completo} (@{u.nombre_usuario})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Permiso *
            </label>
            <select
              value={formData.permiso}
              onChange={(e) => setFormData({ ...formData, permiso: Number(e.target.value) })}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value={0}>Seleccione un permiso</option>
              {permisos.map((p) => (
                <option key={p.id_permiso} value={p.id_permiso}>
                  {p.nombre} ({p.modulo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Acción *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={formData.concedido}
                  onChange={() => setFormData({ ...formData, concedido: true })}
                  className="mr-2"
                />
                <span className="text-sm">✅ Conceder permiso</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!formData.concedido}
                  onChange={() => setFormData({ ...formData, concedido: false })}
                  className="mr-2"
                />
                <span className="text-sm">❌ Revocar permiso</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Motivo *
            </label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
              rows={3}
              placeholder="Explique por qué se asigna/revoca este permiso..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Fecha de Expiración (opcional)
            </label>
            <input
              type="datetime-local"
              value={formData.fecha_expiracion}
              onChange={(e) => setFormData({ ...formData, fecha_expiracion: e.target.value })}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" label="Guardar" color="info" disabled={loading} />
            <Button
              type="button"
              label="Cancelar"
              color="danger"
              onClick={() => setMostrarModal(false)}
            />
          </div>
        </form>
      </Modal>

      {/* Modal de Permisos Efectivos */}
      {usuarioSeleccionado && (
        <PermisosEfectivosModal
          isOpen={mostrarPermisosEfectivos}
          onClose={() => setMostrarPermisosEfectivos(false)}
          usuarioId={usuarioSeleccionado.usuario}
          usuarioNombre={usuarioSeleccionado.usuario_nombre}
        />
      )}

      {/* Contenido */}
      {loading ? (
        <Loading message="Cargando permisos individuales..." />
      ) : permisosIndividuales.length === 0 ? (
        <EmptyState message="No hay permisos individuales asignados" />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto shadow-sm rounded-lg border border-pink-200">
            <table className="w-full">
              <thead className="bg-pink-100">
                <tr>
                  <th className="px-4 py-3 text-left text-pink-800 text-sm font-semibold">Usuario</th>
                  <th className="px-4 py-3 text-left text-pink-800 text-sm font-semibold">Permiso</th>
                  <th className="px-4 py-3 text-center text-pink-800 text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-pink-800 text-sm font-semibold">Motivo</th>
                  <th className="px-4 py-3 text-center text-pink-800 text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center text-pink-800 text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {permisosIndividuales.map((pi) => (
                  <tr key={pi.id} className="border-b hover:bg-pink-50">
                    <td className="px-4 py-3 text-sm text-pink-800">{pi.usuario_nombre}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-pink-800">{pi.permiso_nombre}</div>
                      <div className="text-xs text-pink-600">{pi.permiso_codigo}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={pi.concedido ? "success" : "danger"} size="sm">
                        {pi.tipo_permiso}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{pi.motivo || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={pi.activo ? "success" : "danger"} size="sm">
                        {pi.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => verPermisosEfectivos(pi)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Ver Efectivos
                        </button>
                        <button
                          onClick={() => handleEliminar(pi.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {permisosIndividuales.map((pi) => (
              <div key={pi.id} className="bg-white border border-pink-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-pink-800">{pi.usuario_nombre}</h3>
                    <p className="text-sm text-pink-700">{pi.permiso_nombre}</p>
                    <p className="text-xs text-pink-600 font-mono">{pi.permiso_codigo}</p>
                  </div>
                  <Badge variant={pi.activo ? "success" : "danger"} size="sm">
                    {pi.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <div className="mb-3">
                  <Badge variant={pi.concedido ? "success" : "danger"} size="sm">
                    {pi.tipo_permiso}
                  </Badge>
                </div>

                {pi.motivo && (
                  <p className="text-xs text-gray-600 mb-3">{pi.motivo}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    label="Ver Efectivos"
                    color="info"
                    onClick={() => verPermisosEfectivos(pi)}
                  />
                  <Button
                    label="Eliminar"
                    color="danger"
                    onClick={() => handleEliminar(pi.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ModuleLayout>
  );
}