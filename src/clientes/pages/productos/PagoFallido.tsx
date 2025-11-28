// src/clientes/pages/productos/PagoFallido.tsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";

const PagoFallido: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Hubo un problema con tu pago
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          No se pudo completar la transacción. Por favor, intenta de nuevo o
          contacta a soporte si el problema persiste.
        </p>
        <div className="space-x-4">
          <Link to="/proceso-pago">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Intentar de Nuevo
            </button>
          </Link>
          <Link to="/contacto-cliente">
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Contactar a Soporte
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagoFallido;
