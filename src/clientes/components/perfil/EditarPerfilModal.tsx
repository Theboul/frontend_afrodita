import { useState } from "react";
import { clienteService, type ClientePerfil } from "../../../services/cliente/clienteService";
import { Button } from "../../../components/ui/Button";

export default function EditarPerfilModal({
  show,
  cliente,
  onClose,
  onUpdated,
}: {
  show: boolean;
  cliente: ClientePerfil;
  onClose: () => void;
  onUpdated: (nuevo: ClientePerfil) => void;
}) {
  const [form, setForm] = useState({
    nombre_completo: cliente.nombre_completo,
    telefono: cliente.telefono || "",
    direccion_principal: cliente.direccion_principal || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await clienteService.actualizarPerfil(form);
      if (res.success && res.data) {
        onUpdated(res.data);
        onClose();
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Nombre Completo</label>
            <input
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Dirección Principal</label>
            <input
              name="direccion_principal"
              value={form.direccion_principal}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancelar" color="info" onClick={onClose} />
            <Button
              label={saving ? "Guardando..." : "Guardar Cambios"}
              color="primary"
              type="submit"
              disabled={saving}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
