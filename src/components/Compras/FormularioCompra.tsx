// components/FormularioCompra.tsx
import React from 'react';
import {type NuevaCompra,type Producto,type Proveedor } from '../../services/Compras/comprasService';

interface FormularioCompraProps {
  nuevaCompra: NuevaCompra;
  proveedores: Proveedor[];
  productos: Producto[];
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onItemChange: (index: number, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const FormularioCompra: React.FC<FormularioCompraProps> = ({
  nuevaCompra,
  proveedores,
  productos,
  loading,
  onChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
  onCancel
}) => {
  const calcularTotal = () => {
    return nuevaCompra.items.reduce((total, item) => {
      return total + (item.cantidad * item.precio);
    }, 0);
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Nueva Orden de Compra</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">Proveedor *</label>
          <select
            name="cod_proveedor"
            value={nuevaCompra.cod_proveedor}
            onChange={(e) => onChange('cod_proveedor', e.target.value)}
            required
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.cod_proveedor} value={proveedor.cod_proveedor}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-pink-700">Fecha *</label>
          <input
            type="date"
            name="fecha"
            value={nuevaCompra.fecha}
            onChange={(e) => onChange('fecha', e.target.value)}
            required
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Items de la compra */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Items</h3>
          <button
            type="button"
            onClick={onAddItem}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            + Agregar Item
          </button>
        </div>

        {nuevaCompra.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-3 p-3 bg-gray-50 rounded">
            <div className="md:col-span-4">
              <label className="block text-sm font-semibold mb-1 text-pink-700">Producto</label>
              <select
                value={item.id_producto}
                onChange={(e) => onItemChange(index, 'id_producto', e.target.value)}
                required
                className="w-full border border-pink-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
              >
                <option value="">Seleccionar producto</option>
                {productos.map(producto => (
                  <option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombre} (Stock: {producto.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-pink-700">Cantidad</label>
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => onItemChange(index, 'cantidad', e.target.value)}
                required
                className="w-full border border-pink-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold mb-1 text-pink-700">Precio Unitario</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={item.precio}
                onChange={(e) => onItemChange(index, 'precio', e.target.value)}
                required
                className="w-full border border-pink-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-pink-700">Subtotal</label>
              <div className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100">
                ${(item.cantidad * item.precio).toFixed(2)}
              </div>
            </div>

            <div className="md:col-span-1 flex items-end">
              {nuevaCompra.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm w-full"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="text-right font-semibold text-lg">
          Total: ${calcularTotal().toFixed(2)}
        </div>
      </div>

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
          {loading ? 'Creando...' : 'Crear Orden'}
        </button>
      </div>
    </form>
  );
};

export default FormularioCompra;
