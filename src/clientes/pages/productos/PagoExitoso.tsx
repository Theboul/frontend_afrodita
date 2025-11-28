// src/clientes/pages/productos/PagoExitoso.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { useCarritoStore } from "../../stores/useCarritoStore";

const PagoExitoso: React.FC = () => {
  const { vaciarCarrito } = useCarritoStore();

  // Vaciar el carrito cuando el componente se monta
  useEffect(() => {
    vaciarCarrito();
  }, [vaciarCarrito]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Gracias por tu compra. Hemos recibido tu pago y estamos procesando tu
          pedido.
        </p>
        <div className="space-x-4">
          <Link to="/catalogo-cliente">
            <button className="px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700">
              Seguir Comprando
            </button>
          </Link>
          <Link to="/perfil-cliente/compras">
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Ver Mis Pedidos
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagoExitoso;
