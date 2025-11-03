import React from "react";
import { useCarritoStore } from "../../stores/useCarritoStore";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

const Carrito: React.FC = () => {
  const productos = useCarritoStore((state) => state.productos);
  const { aumentarCantidad, disminuirCantidad, eliminarProducto } = useCarritoStore();

  const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header  />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-2xl font-bold mb-6">🛒 Mi Carrito</h1>

        {productos.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex-1 ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
                  <h2 className="font-semibold text-lg">{prod.nombre}</h2>
                  {prod.descripcion && (
                    <p className="text-gray-500 text-sm">{prod.descripcion}</p>
                  )}
                  <p className="font-bold mt-1">Bs {prod.precio.toFixed(2)}</p>

                  <div className="flex items-center justify-center sm:justify-start mt-2 space-x-2">
                    <button
                      onClick={() => disminuirCantidad(prod.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-2">{prod.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(prod.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>

                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 text-right font-bold text-xl">
              Total: Bs {total.toFixed(2)}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Carrito;
