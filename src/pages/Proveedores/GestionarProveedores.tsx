// views/GestionarProveedores.tsx
import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';
import Button from '../../components/ui/Button';
import FormularioProveedor from '../../components/Proveedores/FormularioProveedor';
import TablaProveedores from '../../components/Proveedores/TablaProveedores';
import { 
  proveedoresService, 
  type Proveedor, 
  type CrearProveedor 
} from '../../services/Proveedores/proveedoresService';

const GestionarProveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);
  const [nuevoProveedor, setNuevoProveedor] = useState<CrearProveedor>({
    cod_proveedor: '',
    nombre: '',
    contacto: '',
    telefono: '',
    direccion: '',
    pais: '',
    estado_proveedor: 'ACTIVO'
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar proveedores al iniciar
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setError('');
      const data = await proveedoresService.obtenerProveedores();
      setProveedores(data);
    } catch (error: any) {
      console.error('Error cargando proveedores:', error);
      if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('Error al cargar los proveedores. Intente nuevamente.');
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setNuevoProveedor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCrearProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoProveedor.cod_proveedor || !nuevoProveedor.nombre || !nuevoProveedor.contacto) {
      alert('Por favor complete los campos requeridos (Código, Nombre y Contacto)');
      return;
    }

    setLoading(true);
    try {
      await proveedoresService.crearProveedor(nuevoProveedor);
      alert('Proveedor creado exitosamente');
      resetForm();
      cargarProveedores();
    } catch (error: any) {
      console.error('Error creando proveedor:', error);
      alert(error.response?.data?.message || 'Error al crear el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proveedorEditando) return;

    setLoading(true);
    try {
      const { cod_proveedor, estado_proveedor, ...datosActualizacion } = nuevoProveedor;
      await proveedoresService.actualizarProveedor(proveedorEditando.cod_proveedor, datosActualizacion);
      alert('Proveedor actualizado exitosamente');
      resetForm();
      cargarProveedores();
    } catch (error: any) {
      console.error('Error actualizando proveedor:', error);
      alert(error.response?.data?.message || 'Error al actualizar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleBloquearProveedor = async (codProveedor: string) => {
    if (!confirm('¿Está seguro de bloquear este proveedor?')) return;

    try {
      await proveedoresService.bloquearProveedor(codProveedor);
      alert('Proveedor bloqueado exitosamente');
      cargarProveedores();
    } catch (error: any) {
      console.error('Error bloqueando proveedor:', error);
      alert(error.response?.data?.message || 'Error al bloquear el proveedor');
    }
  };

  const handleActivarProveedor = async (codProveedor: string) => {
    if (!confirm('¿Está seguro de activar este proveedor?')) return;

    try {
      await proveedoresService.activarProveedor(codProveedor);
      alert('Proveedor activado exitosamente');
      cargarProveedores();
    } catch (error: any) {
      console.error('Error activando proveedor:', error);
      alert(error.response?.data?.message || 'Error al activar el proveedor');
    }
  };

  const handleEditar = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setNuevoProveedor({
      cod_proveedor: proveedor.cod_proveedor,
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono || '',
      direccion: proveedor.direccion || '',
      pais: proveedor.pais || '',
      estado_proveedor: proveedor.estado_proveedor
    });
    setShowForm(true);
  };

  const handleVerDetalle = (proveedor: Proveedor) => {
    const detalle = `
Código: ${proveedor.cod_proveedor}
Nombre: ${proveedor.nombre}
Contacto: ${proveedor.contacto}
Teléfono: ${proveedor.telefono || 'No especificado'}
Dirección: ${proveedor.direccion || 'No especificada'}
País: ${proveedor.pais || 'No especificado'}
Estado: ${proveedor.estado_proveedor}
    `;
    alert(detalle);
  };

  const resetForm = () => {
    setNuevoProveedor({
      cod_proveedor: '',
      nombre: '',
      contacto: '',
      telefono: '',
      direccion: '',
      pais: '',
      estado_proveedor: 'ACTIVO'
    });
    setProveedorEditando(null);
    setShowForm(false);
  };

  const esEdicion = !!proveedorEditando;

  return (
    <ModuleLayout title="Gestión de Proveedores">
      {/* Header con botón y totales */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-sm sm:text-base text-gray-600">Total: {proveedores.length} proveedores</p>
        </div>
        {!showForm && (
          <Button label="+ Nuevo Proveedor" color="success" onClick={() => setShowForm(true)} />
        )}
      </div>

      {/* Filtros (placeholder) */}
      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <p className="text-sm sm:text-base text-gray-600">Filtros (próximamente)...</p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
          Error: {error}
          <div className="mt-2">
            <Button label="Reintentar" color="danger" onClick={cargarProveedores} />
          </div>
        </div>
      )}

      {/* Formulario de proveedor */}
      {!error && showForm && (
        <FormularioProveedor
          proveedor={proveedorEditando}
          datos={nuevoProveedor}
          loading={loading}
          esEdicion={esEdicion}
          onChange={handleChange}
          onSubmit={esEdicion ? handleActualizarProveedor : handleCrearProveedor}
          onCancel={resetForm}
        />
      )}

      {/* Lista de proveedores */}
      {!error && (
        <TablaProveedores
          proveedores={proveedores}
          onEditar={handleEditar}
          onBloquear={handleBloquearProveedor}
          onActivar={handleActivarProveedor}
          onVerDetalle={handleVerDetalle}
        />
      )}
    </ModuleLayout>
  );
};

export default GestionarProveedores;
