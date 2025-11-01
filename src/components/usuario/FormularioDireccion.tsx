import { useState, useEffect } from 'react';
import type { Direccion, DireccionCreate } from '../../services/direcciones/direccionesService';

interface FormularioDireccionProps {
  direccion?: Direccion | null;
  onSubmit: (datos: DireccionCreate) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function FormularioDireccion({
  direccion,
  onSubmit,
  onCancel,
  loading
}: FormularioDireccionProps) {
  const [formData, setFormData] = useState<DireccionCreate>({
    etiqueta: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: 'Perú',
    referencia: '',
    es_principal: false,
    guardada: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (direccion) {
      setFormData({
        etiqueta: direccion.etiqueta || '',
        direccion: direccion.direccion || '',
        ciudad: direccion.ciudad || '',
        departamento: direccion.departamento || '',
        pais: direccion.pais || 'Perú',
        referencia: direccion.referencia || '',
        es_principal: direccion.es_principal || false,
        guardada: direccion.guardada !== undefined ? direccion.guardada : true
      });
    }
  }, [direccion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {direccion ? 'Editar Dirección' : 'Nueva Dirección'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Etiqueta */}
        <div>
          <label htmlFor="etiqueta" className="block text-sm font-medium text-gray-700 mb-1">
            Etiqueta (opcional)
          </label>
          <input
            type="text"
            id="etiqueta"
            name="etiqueta"
            value={formData.etiqueta}
            onChange={handleChange}
            placeholder="Ej: Casa, Trabajo, Oficina"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. Arequipa 1234, Dpto 502"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm ${
              errors.direccion ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.direccion && (
            <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
          )}
        </div>

        {/* Ciudad y Departamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Ej: Lima"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              placeholder="Ej: Lima"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* País */}
        <div>
          <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">
            País
          </label>
          <input
            type="text"
            id="pais"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            placeholder="Ej: Perú"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Referencia */}
        <div>
          <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">
            Referencia (opcional)
          </label>
          <textarea
            id="referencia"
            name="referencia"
            value={formData.referencia}
            onChange={handleChange}
            placeholder="Ej: Edificio azul, frente al parque Kennedy"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        {/* Marcar como principal */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="es_principal"
            name="es_principal"
            checked={formData.es_principal}
            onChange={handleChange}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
          />
          <label htmlFor="es_principal" className="text-sm font-medium text-gray-700 cursor-pointer">
            Marcar como dirección principal
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : (direccion ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
}
