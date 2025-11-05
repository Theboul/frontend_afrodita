import { useState } from "react";
import Button from "../ui/Button";

interface PermisoFormData {
  nombre: string;
  codigo: string;
  descripcion: string;
  modulo: string;
  activo: boolean;
}

interface PermisoFormProps {
  initialData?: PermisoFormData;
  modulos: string[];
  onSubmit: (data: PermisoFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export default function PermisoForm({
  initialData,
  modulos,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}: PermisoFormProps) {
  const [formData, setFormData] = useState<PermisoFormData>(
    initialData || { nombre: "", codigo: "", descripcion: "", modulo: "", activo: true }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">
          Nombre del Permiso *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          placeholder="Ej: productos.crear"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">Código *</label>
        <input
          type="text"
          value={formData.codigo}
          onChange={(e) =>
            setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
          }
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent font-mono"
          placeholder="Ej: PRODUCT_CREATE"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Debe estar en MAYÚSCULAS</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">Módulo *</label>
        <input
          type="text"
          value={formData.modulo}
          onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
          list="modulos-list"
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          placeholder="Ej: productos, usuarios, ventas"
          required
        />
        <datalist id="modulos-list">
          {modulos.map((mod) => (
            <option key={mod} value={mod} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-pink-700 mb-2">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          placeholder="Descripción del permiso..."
          rows={3}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="activo"
          checked={formData.activo}
          onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
          className="w-4 h-4 text-pink-600 focus:ring-pink-400 rounded"
        />
        <label htmlFor="activo" className="ml-2 text-sm text-pink-700">
          Permiso activo
        </label>
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