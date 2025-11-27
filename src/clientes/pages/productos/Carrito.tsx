import React, { useEffect, useState } from "react";
import { useCarritoStore } from "../../stores/useCarritoStore";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { useNavigate } from "react-router-dom";


const Carrito: React.FC = () => {
  const {
    productos,
    cargarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
  } = useCarritoStore();

  const [loading, setLoading] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await cargarCarrito();
      setLoading(false);
    };
    init();
  }, []);

  const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  const handleAumentar = async (prod: any) => {
    if (prod.cantidad >= prod.stock) {
      setErrorStock("No hay más stock disponible");
      return;
    }
    setErrorStock(null);
    await aumentarCantidad(prod.id);
  };

  return (
    <div>
      <Header />

       
   <main className="flex-1 w-full px-4 sm:px-6 lg:px-11 mt-20">

        {/* TABS DE NAVEGACIÓN ENTRE CARRITO Y ENVÍO */}
     <div className="w-full flex justify-center mt-16 md:mt-20 lg:mt-32 mb-10 md:mb-16">
          <div className="flex border-b border-gray-400 w-full max-w-xl sm:max-w-2xl justify-around text-center">
    
          
          {/* TAB Carrito */}
           <button
              onClick={() => navigate("/carrito-cliente")}
              className="px-3 sm:px-6 py-2 font-semibold text-base sm:text-lg 
              border-b-4 transition border-purple-600 text-purple-600 w-1/2"
            >
              Carrito
            </button>

            <button
              onClick={() => navigate("/envio-cliente")}
              className="px-3 sm:px-6 py-2 font-semibold text-base sm:text-lg 
              text-gray-500 hover:text-purple-600 w-1/2
              border-b-4 border-transparent hover:border-purple-300 transition"
             
            >
              Información
            </button>


        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6">🛒 Mi Carrito</h1>
        {loading ? (
          <p>Cargando carrito...</p>
        ) : productos.length === 0 ? (
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

                  {errorStock && <p className="text-red-500 text-sm">{errorStock}</p>}

                  <div className="flex items-center justify-center sm:justify-start mt-2 space-x-2">
                    <button
                      onClick={() => disminuirCantidad(prod.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-2">{prod.cantidad}</span>
                    <button
                      onClick={() => handleAumentar(prod)}
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
