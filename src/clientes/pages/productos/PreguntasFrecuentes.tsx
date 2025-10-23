// src/clientes/pages/productos/PreguntasFrecuentes.tsx
import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const preguntas = [
  {
    pregunta: "¿Cómo debo limpiar mis lentes de contacto?",
    respuesta:
      "Lava tus manos antes de manipular los lentes, usa solución multipropósito y nunca uses agua del grifo.",
  },
  {
    pregunta: "¿Cuánto tiempo puedo usar mis lentes de contacto diarios?",
    respuesta:
      "Los lentes de contacto diarios deben desecharse al final del día; no los reutilices.",
  },
  {
    pregunta: "¿Puedo usar lentes de contacto si tengo astigmatismo?",
    respuesta:
      "Sí, existen lentes diseñados específicamente para astigmatismo. Consulta con tu óptico.",
  },
  {
    pregunta: "¿Cada cuánto debo cambiar el estuche de mis lentes?",
    respuesta:
      "Se recomienda cambiar el estuche cada 3 meses para evitar bacterias y hongos.",
  },
];

const PreguntasFrecuentes: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header logoSrc="/assets/1.png" />

      {/* Contenido principal */}
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#C25B8C] mb-8 text-center">
          Preguntas Frecuentes sobre Lentes de Contacto
        </h1>

        <div className="space-y-6">
          {preguntas.map((item, index) => (
            <div key={index} className="border-l-4 border-[#C25B8C] pl-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.pregunta}
              </h2>
              <p className="mt-1 text-gray-600">{item.respuesta}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer logoSrc="/assets/1.png" />
    </div>
  );
};

export default PreguntasFrecuentes;
