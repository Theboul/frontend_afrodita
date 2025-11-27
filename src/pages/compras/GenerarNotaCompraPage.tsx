import React, { useState } from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock data - in a real app, this would come from an API
const mockProveedores = [
  { id: 1, nombre: 'Proveedor A' },
  { id: 2, nombre: 'Proveedor B' },
  { id: 3, nombre: 'Proveedor C' },
];

const mockProductos = [
  { id: 1, nombre: 'Producto 1', stock: 100 },
  { id: 2, nombre: 'Producto 2', stock: 50 },
  { id: 3, nombre: 'Producto 3', stock: 200 },
];

interface ItemNota {
  id_producto: string;
  cantidad: number;
  precio: number;
}

const GenerarNotaCompraPage: React.FC = () => {
  const [proveedorId, setProveedorId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<ItemNota[]>([
    { id_producto: '', cantidad: 1, precio: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (index: number, field: keyof ItemNota, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { id_producto: '', cantidad: 1, precio: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (Number(item.cantidad) * Number(item.precio)), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log({
        proveedorId,
        fecha,
        items,
        total: calcularTotal(),
      });
      setLoading(false);
      alert('Nota de compra generada con éxito (ver consola)');
    }, 1500);
  };

  return (
    <ModuleLayout title="Generar Nota de Compra">
      <div className="max-w-4xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-6">Generar Nota de Compra para Proveedores</h2>

            {/* Proveedor y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="proveedor">
                  Proveedor
                </label>
                <select
                  id="proveedor"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">Seleccione un proveedor</option>
                  {mockProveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha">
                  Fecha de Emisión
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Items de la Nota */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
                <Button type="button" label="+ Agregar Producto" color="info" onClick={handleAddItem} />
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-x-4 gap-y-2 p-3 bg-gray-50 rounded-lg items-center">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-xs font-medium text-gray-600">Producto</label>
                      <select
                        value={item.id_producto}
                        onChange={(e) => handleItemChange(index, 'id_producto', e.target.value)}
                        required
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      >
                        <option value="">Seleccionar</option>
                        {mockProductos.map((p) => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                       <label className="block text-xs font-medium text-gray-600">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))}
                        required
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                       <label className="block text-xs font-medium text-gray-600">Precio</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.precio}
                        onChange={(e) => handleItemChange(index, 'precio', Number(e.target.value))}
                        required
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    
                    <div className="col-span-10 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600">Subtotal</label>
                        <p className="text-sm font-medium text-gray-800 mt-2">
                            ${(item.cantidad * item.precio).toFixed(2)}
                        </p>
                    </div>

                    <div className="col-span-2 md:col-span-1 flex justify-end items-center mt-4">
                      {items.length > 1 && (
                        <Button type="button" label="X" color="danger" onClick={() => handleRemoveItem(index)} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total y Acciones */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-2xl font-bold text-gray-800">
                    Total: ${calcularTotal().toFixed(2)}
                </div>
                <div className="flex gap-4">
                    <Button type="button" label="Cancelar" color="info" onClick={() => { /* logic to cancel */ }} />
                    <Button type="submit" label={loading ? 'Generando...' : 'Generar Nota'} color="primary" disabled={loading} />
                </div>
            </div>
          </form>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default GenerarNotaCompraPage;