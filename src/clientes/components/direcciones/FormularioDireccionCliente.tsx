import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import type { Direccion, CrearDireccionData } from '../../../services/cliente/direccionesClienteService';

interface FormularioDireccionClienteProps {
  direccion?: Direccion | null;
  onSubmit: (datos: CrearDireccionData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function FormularioDireccionCliente({
  direccion,
  onSubmit,
  onCancel,
  loading
}: FormularioDireccionClienteProps) {
  const [formData, setFormData] = useState<CrearDireccionData>({
    etiqueta: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: 'Bolivia',
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
        pais: direccion.pais || 'Bolivia',
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

    if (!formData.direccion?.trim()) {
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
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Dirección completa */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección Completa <span className="text-red-500">*</span>
          </label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. Arequipa 1234, Dpto 502, La cuchilla"
            rows={3}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
              errors.direccion ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.direccion && (
            <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
          )}
        </div>

        {/* Ciudad y Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Ej: Santa Cruz de la Sierra"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
              placeholder="Ej: Santa Cruz"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            placeholder="Ej: Bolivia"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            placeholder="Ej: Frente al parque, al lado de la farmacia"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Es principal */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="es_principal"
            name="es_principal"
            checked={formData.es_principal}
            onChange={handleChange}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="es_principal" className="ml-2 text-sm text-gray-700">
            Marcar como dirección principal
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button
            label="Cancelar"
            color="info"
            onClick={onCancel}
            disabled={loading}
            type="button"
          />
          <Button
            label={loading ? "Guardando..." : direccion ? "Actualizar" : "Crear Dirección"}
            color="primary"
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
