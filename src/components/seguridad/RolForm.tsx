import { useState } from "react";
import Button from "../ui/Button";
import { type Permiso } from "../../services/seguridad/seguridadService";

interface RolFormData {
  nombre: string;
  descripcion: string;
  permisos_ids: number[];
}

interface RolFormProps {
  initialData?: RolFormData;
  permisos: Permiso[];
  onSubmit: (data: RolFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export default function RolForm({
  initialData,
  permisos,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}: RolFormProps) {
  const [formData, setFormData] = useState<RolFormData>(
    initialData || { nombre: "", descripcion: "", permisos_ids: [] }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const togglePermiso = (permisoId: number) => {
    setFormData((prev) => ({
      ...prev,
      permisos_ids: prev.permisos_ids.includes(permisoId)
        ? prev.permisos_ids.filter((id) => id !== permisoId)
        : [...prev.permisos_ids, permisoId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">
          Nombre del Rol *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          placeholder="Ej: VENDEDOR"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          placeholder="Descripción del rol..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">
          Permisos ({formData.permisos_ids.length} seleccionados)
        </label>
        <div className="border border-pink-200 rounded-lg p-4 max-h-48 md:max-h-60 overflow-y-auto">
          {permisos.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay permisos disponibles</p>
          ) : (
            <div className="space-y-2">
              {permisos.map((permiso) => (
                <label
                  key={permiso.id_permiso}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-pink-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.permisos_ids.includes(permiso.id_permiso)}
                    onChange={() => togglePermiso(permiso.id_permiso)}
                    className="w-4 h-4 mt-0.5 text-pink-600 focus:ring-pink-400 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-pink-800">{permiso.nombre}</span>
                    <span className="text-xs text-gray-500 ml-2">({permiso.modulo})</span>
                    {permiso.descripcion && (
                      <p className="text-xs text-gray-600 mt-1">{permiso.descripcion}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button
          type="submit"
          label={isEdit ? "Actualizar" : "Guardar"}
          color="info"
          disabled={loading}
        />
        <Button type="button" label="Cancelar" color="info" onClick={onCancel} />
      </div>
    </form>
  );
}