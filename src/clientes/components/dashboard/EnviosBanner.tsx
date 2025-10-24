import React from "react";
import { Truck } from "lucide-react"; // ícono de camión (puedes quitarlo si no lo querés)

const EnviosTodoBolivia: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <button
        className="
          relative overflow-hidden 
          bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 
          text-white font-bold text-xl 
          px-8 py-4 
          rounded-2xl shadow-lg 
          transition-transform transform 
          hover:scale-105 active:scale-95 
          hover:shadow-2xl 
          focus:outline-none 
          animate-gradient-x
        "
      >
        <span className="flex items-center gap-3">
          <Truck className="w-6 h-6" />
          Envíos a Todo Bolivia
        </span>

        {/* efecto de brillo animado */}
        <span
          className="
            absolute inset-0 opacity-20 
            bg-gradient-to-r from-white via-transparent to-white 
            animate-[shimmer_2s_infinite]
          "
        />
      </button>

      {/* animaciones personalizadas */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default EnviosTodoBolivia;