import type { FC } from "react";

interface DatosPersonalesProps {
  nombre: string;
  correo: string;
  telefono: string;
}

const DatosPersonales: FC<DatosPersonalesProps> = ({
  nombre,
  correo,
  telefono,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">

      <div className="flex items-center gap-2 mb-6">
        <span className="text-pink-600 text-xl">👤</span>
        <h3 className="text-xl font-semibold text-gray-800">Datos Personales</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nombre Completo *
          </label>
          <input
            disabled
            value={nombre}
            className="w-full p-3 border rounded bg-white text-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email *
          </label>
          <input
            disabled
            value={correo}
            className="w-full p-3 border rounded bg-white text-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Teléfono *
          </label>
          <input
            disabled
            value={telefono}
            className="w-full p-3 border rounded bg-white text-gray-600"
          />
        </div>

      </div>
    </div>
  );
};

export default DatosPersonales;
