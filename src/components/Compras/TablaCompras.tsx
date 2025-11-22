// components/TablaCompras.tsx
import React from 'react';
import { type Compra,type Producto,type Proveedor } from '../../services/Compras/comprasService';

interface TablaComprasProps {
  compras: Compra[];
  productos: Producto[];
  proveedores: Proveedor[];
  onRegistrarRecepcion: (idCompra: number) => void;
}

const TablaCompras: React.FC<TablaComprasProps> = ({
  compras,
  productos,
  proveedores,
  onRegistrarRecepcion
}) => {
  const obtenerNombreProducto = (idProducto: string) => {
    const producto = productos.find(p => p.id_producto === idProducto);
    return producto?.nombre || idProducto;
  };

  const obtenerNombreProveedor = (codProveedor: string) => {
    const proveedor = proveedores.find(p => p.cod_proveedor === codProveedor);
    return proveedor?.nombre || codProveedor;
  };

  const mostrarItems = (items: any[]) => {
    const itemsInfo = items.map(item => 
      `${obtenerNombreProducto(item.id_producto)}: ${item.cantidad} x $${item.precio}`
    ).join('\n');
    alert(`Items:\n${itemsInfo}`);
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Lista de Órdenes de Compra
      </h2>

      {compras.length === 0 ? (
        <p className="text-center text-gray-500">No hay órdenes de compra registradas.</p>
      ) : (
        <>
          {/* Tabla para desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow p-4">
            <table className="w-full border-collapse">
              <thead className="bg-pink-300 text-black">
                <tr>
                  <th className="border border-pink-200 px-3 py-2 text-left">ID</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Fecha</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Proveedor</th>
                  <th className="border border-pink-200 px-3 py-2 text-right">Monto Total</th>
                  <th className="border border-pink-200 px-3 py-2 text-left">Estado</th>
                  <th className="border border-pink-200 px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.id_compra} className="hover:bg-pink-50 transition">
                    <td className="border border-pink-200 px-3 py-2">{compra.id_compra}</td>
                    <td className="border border-pink-200 px-3 py-2">{compra.fecha}</td>
                    <td className="border border-pink-200 px-3 py-2">
                      {obtenerNombreProveedor(compra.cod_proveedor)}
                    </td>
                    <td className="border border-pink-200 px-3 py-2 text-right">
                      ${Number((compra as any).monto_total ?? 0).toFixed(2)}
                    </td>
                    <td className="border border-pink-200 px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        compra.estado_compra === 'FINALIZADA' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {compra.estado_compra}
                      </span>
                    </td>
                    <td className="border border-pink-200 px-3 py-2">
                      {compra.estado_compra === 'PENDIENTE' && (
                        <button
                          onClick={() => onRegistrarRecepcion(compra.id_compra)}
                          className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition mr-2"
                        >
                          Recepción
                        </button>
                      )}
                      <button
                        onClick={() => mostrarItems(compra.items)}
                        className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Ver Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para móvil */}
          <div className="md:hidden space-y-3">
            {compras.map((compra) => (
              <div key={compra.id_compra} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500">ID</div>
                    <div className="font-semibold text-black">{compra.id_compra}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Fecha</div>
                    <div className="font-semibold">{compra.fecha}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Proveedor</div>
                    <div className="font-semibold">{obtenerNombreProveedor(compra.cod_proveedor)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Monto</div>
                    <div className="font-semibold">${Number((compra as any).monto_total ?? 0).toFixed(2)}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Estado</div>
                    <div className="font-semibold">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        compra.estado_compra === 'FINALIZADA' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {compra.estado_compra}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {compra.estado_compra === 'PENDIENTE' && (
                    <button
                      onClick={() => onRegistrarRecepcion(compra.id_compra)}
                      className="flex-1 text-sm px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Registrar Recepción
                    </button>
                  )}
                  <button
                    onClick={() => mostrarItems(compra.items)}
                    className="flex-1 text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Ver Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TablaCompras;
