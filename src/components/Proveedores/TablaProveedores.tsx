// components/TablaProveedores.tsx
import React from 'react';
import Button from '../ui/Button';
import { type Proveedor } from '../../services/Proveedores/proveedoresService';

interface TablaProveedoresProps {
  proveedores: Proveedor[];
  onEditar: (proveedor: Proveedor) => void;
  onBloquear: (codProveedor: string) => void;
  onActivar: (codProveedor: string) => void;
  onVerDetalle: (proveedor: Proveedor) => void;
}

const TablaProveedores: React.FC<TablaProveedoresProps> = ({
  proveedores,
  onEditar,
  onBloquear,
  onActivar,
  onVerDetalle
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'BLOQUEADO':
        return 'bg-red-100 text-red-800';
      case 'INACTIVO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'Activo';
      case 'BLOQUEADO':
        return 'Bloqueado';
      case 'INACTIVO':
        return 'Inactivo';
      default:
        return estado;
    }
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Lista de Proveedores
      </h2>

      {proveedores.length === 0 ? (
        <p className="text-center text-gray-500">No hay proveedores registrados.</p>
      ) : (
        <>
          {/* Tabla para desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow p-4">
            <table className="w-full border-collapse">
              <thead className="bg-pink-300 text-black">
                <tr>
                  <th className="border border-pink-200 px-3 py-2 text-left">Código</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Nombre</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Contacto</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Teléfono</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">País</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Estado</th>
                  <th className="border border-pink-200 px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor) => (
                  <tr key={proveedor.cod_proveedor} className="hover:bg-pink-50 transition">
                    <td className="border border-pink-200 px-3 py-2 font-mono">
                      {proveedor.cod_proveedor}
                    </td>
                    <td className="border border-pink-200 px-3 py-2">{proveedor.nombre}</td>
                    <td className="border border-pink-200 px-3 py-2">{proveedor.contacto}</td>
                    <td className="border border-pink-200 px-3 py-2">
                      {proveedor.telefono || '-'}
                    </td>
                    <td className="border border-pink-200 px-3 py-2">
                      {proveedor.pais || '-'}
                    </td>
                    <td className="border border-pink-200 px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(proveedor.estado_proveedor)}`}>
                        {getEstadoTexto(proveedor.estado_proveedor)}
                      </span>
                    </td>
                    <td className="border border-pink-200 px-3 py-2 text-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button label="Ver" color="info" onClick={() => onVerDetalle(proveedor)} />
                        <Button label="Editar" color="warning" onClick={() => onEditar(proveedor)} />
                        {proveedor.estado_proveedor === 'ACTIVO' ? (
                          <Button label="Bloquear" color="danger" onClick={() => onBloquear(proveedor.cod_proveedor)} />
                        ) : (
                          <Button label="Activar" color="success" onClick={() => onActivar(proveedor.cod_proveedor)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para móvil */}
          <div className="md:hidden space-y-3">
            {proveedores.map((proveedor) => (
              <div key={proveedor.cod_proveedor} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500">Código</div>
                    <div className="font-semibold text-black font-mono">{proveedor.cod_proveedor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Estado</div>
                    <div className="font-semibold">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(proveedor.estado_proveedor)}`}>
                        {getEstadoTexto(proveedor.estado_proveedor)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-3">
                  <div>
                    <div className="text-sm text-gray-500">Nombre</div>
                    <div className="font-semibold">{proveedor.nombre}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Contacto</div>
                    <div className="font-semibold">{proveedor.contacto}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Teléfono</div>
                    <div className="font-semibold">{proveedor.telefono || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">País</div>
                    <div className="font-semibold">{proveedor.pais || '-'}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onVerDetalle(proveedor)}
                    className="flex-1 text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEditar(proveedor)}
                    className="flex-1 text-sm px-3 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition"
                  >
                    Editar
                  </button>
                  {proveedor.estado_proveedor === 'ACTIVO' ? (
                    <button
                      onClick={() => onBloquear(proveedor.cod_proveedor)}
                      className="flex-1 text-sm px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Bloquear
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivar(proveedor.cod_proveedor)}
                      className="flex-1 text-sm px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Activar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TablaProveedores;
