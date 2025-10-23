import { type Configuracion } from "../../services/productos/ProductoService";

interface ConfiguracionSelectProps {
  configuraciones: Configuracion[];
  valor: string;
  onChange: (value: string) => void;
}

export default function ConfiguracionSelect({ configuraciones, valor, onChange }: ConfiguracionSelectProps) {
  return (
    <>
      <label className="block text-gray-700 mb-2 font-medium">Configuración (solo lentes)</label>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-xl px-4 py-2 w-full mb-6 focus:ring-2 focus:ring-pink-300"
      >
        <option value="">Seleccione una configuración...</option>
        {configuraciones.map((cfg) => (
          <option key={cfg.id_configuracion} value={cfg.id_configuracion}>
            {`${cfg.id_configuracion} - ${cfg.color} (${cfg.curva}/${cfg.diametro}mm) - ${cfg.medida_info.medida} ${cfg.medida_info.descripcion}`}
          </option>
        ))}
      </select>
    </>
  );
}