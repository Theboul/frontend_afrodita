// views/GestionarCompra.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import FormularioCompra from '../../components/Compras/FormularioCompra';
import TablaCompras from '../../components/Compras/TablaCompras';
import { comprasService,type Compra,type NuevaCompra,type Producto, type Proveedor } from '../../services/Compras/comprasService';

const GestionarCompra: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<NuevaCompra>({
    cod_proveedor: '',
    fecha: new Date().toISOString().split('T')[0],
    items: [{ id_producto: '', cantidad: 1, precio: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [comprasData, proveedoresData, productosData] = await Promise.all([
        comprasService.obtenerCompras(),
        comprasService.obtenerProveedores(),
        comprasService.obtenerProductos()
      ]);
      
      setCompras(comprasData);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    }
  };

  const handleChange = (field: string, value: string) => {
    setNuevaCompra(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...nuevaCompra.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value
    };
    
    setNuevaCompra(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const agregarItem = () => {
    setNuevaCompra(prev => ({
      ...prev,
      items: [...prev.items, { id_producto: '', cantidad: 1, precio: 0 }]
    }));
  };

  const removerItem = (index: number) => {
    if (nuevaCompra.items.length > 1) {
      const updatedItems = nuevaCompra.items.filter((_, i) => i !== index);
      setNuevaCompra(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const crearCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevaCompra.cod_proveedor || !nuevaCompra.fecha) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar items
    for (const item of nuevaCompra.items) {
      if (!item.id_producto || item.cantidad <= 0 || item.precio <= 0) {
        alert('Por favor complete todos los campos de los items correctamente');
        return;
      }
    }

    setLoading(true);
    try {
      await comprasService.crearCompra(nuevaCompra);
      alert('Compra creada exitosamente');
      resetForm();
      cargarDatos();
    } catch (error: any) {
      console.error('Error creando compra:', error);
      alert(error.response?.data?.message || 'Error al crear la compra');
    } finally {
      setLoading(false);
    }
  };

  const registrarRecepcion = async (idCompra: number) => {
    if (!confirm('¿Está seguro de registrar la recepción de esta compra?')) return;

    try {
      await comprasService.registrarRecepcion(idCompra);
      alert('Recepción registrada exitosamente');
      cargarDatos();
    } catch (error: any) {
      console.error('Error registrando recepción:', error);
      alert(error.response?.data?.message || 'Error al registrar la recepción');
    }
  };

  const resetForm = () => {
    setNuevaCompra({
      cod_proveedor: '',
      fecha: new Date().toISOString().split('T')[0],
      items: [{ id_producto: '', cantidad: 1, precio: 0 }]
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Gestión de Compras
        </h1>

        {/* Botón para mostrar/ocultar formulario */}
        <div className="text-center mb-6">
          <Button
            label={showForm ? 'Cancelar' : 'Nueva Compra'}
            color={showForm ? 'danger' : 'success'}
            onClick={() => setShowForm(!showForm)}
          />
        </div>

        {/* Formulario de compra */}
        {showForm && (
          <FormularioCompra
            nuevaCompra={nuevaCompra}
            proveedores={proveedores}
            productos={productos}
            loading={loading}
            onChange={handleChange}
            onItemChange={handleItemChange}
            onAddItem={agregarItem}
            onRemoveItem={removerItem}
            onSubmit={crearCompra}
            onCancel={resetForm}
          />
        )}

        {/* Lista de compras */}
        <TablaCompras
          compras={compras}
          productos={productos}
          proveedores={proveedores}
          onRegistrarRecepcion={registrarRecepcion}
        />
      </div>
    </div>
  );
};

export default GestionarCompra;
