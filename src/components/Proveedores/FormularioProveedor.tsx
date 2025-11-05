// components/FormularioProveedor.tsx
import React from 'react';
import {type CrearProveedor,type Proveedor } from '../../services/Proveedores/proveedoresService';

interface FormularioProveedorProps {
  proveedor?: Proveedor | null;
  datos: CrearProveedor;
  loading: boolean;
  esEdicion: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({
  proveedor,
  datos,
  loading,
  esEdicion,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {esEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Código de Proveedor */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">
            Código Proveedor *
          </label>
          <input
            type="text"
            name="cod_proveedor"
            value={datos.cod_proveedor}
            onChange={(e) => onChange('cod_proveedor', e.target.value)}
            required
            disabled={esEdicion}
            maxLength={6}
            placeholder="Máx. 6 caracteres"
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            required
            maxLength={60}
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Contacto */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">
            Contacto *
          </label>
          <input
            type="text"
            name="contacto"
            value={datos.contacto}
            onChange={(e) => onChange('contacto', e.target.value)}
            required
            maxLength={50}
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={datos.telefono || ''}
            onChange={(e) => onChange('telefono', e.target.value)}
            maxLength={20}
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* País */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-700">
            País
          </label>
          <input
            type="text"
            name="pais"
            value={datos.pais || ''}
            onChange={(e) => onChange('pais', e.target.value)}
            maxLength={30}
            className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Estado (solo en creación) */}
        {!esEdicion && (
          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">
              Estado
            </label>
            <select
              name="estado_proveedor"
              value={datos.estado_proveedor || 'ACTIVO'}
              onChange={(e) => onChange('estado_proveedor', e.target.value)}
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </div>
        )}
      </div>

      {/* Dirección (full width) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1 text-pink-700">
          Dirección
        </label>
        <input
          type="text"
          name="direccion"
          value={datos.direccion || ''}
          onChange={(e) => onChange('direccion', e.target.value)}
          maxLength={100}
          className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-2 rounded-lg transition"
        >
          {loading ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Proveedor')}
        </button>
      </div>
    </form>
  );
};

export default FormularioProveedor;
