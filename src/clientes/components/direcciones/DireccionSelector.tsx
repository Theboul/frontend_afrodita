// src/clientes/components/direcciones/DireccionSelector.tsx
import React, { useEffect, useState } from "react";
import type {
  Direccion,
  CrearDireccionData,
} from "../../../services/cliente/direccionesClienteService";
import { direccionesClienteService } from "../../../services/cliente/direccionesClienteService";
import FormularioDireccionCliente from "./FormularioDireccionCliente";
import Modal from "../../../components/ui/Modal";

interface Props {
  onDireccionSeleccionada: (direccion: Direccion | null) => void;
}

const DireccionSelector: React.FC<Props> = ({ onDireccionSeleccionada }) => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const cargarDirecciones = async () => {
    try {
      setLoading(true);
      const response = await direccionesClienteService.listarMisDirecciones();
      const fetchedDirecciones = response.data?.direcciones || [];
      setDirecciones(fetchedDirecciones);
      setError(null);

      const principal = fetchedDirecciones.find((d: Direccion) => d.es_principal);
      if (principal) {
        setSelectedId(principal.id_direccion);
        onDireccionSeleccionada(principal);
      } else if (fetchedDirecciones.length > 0) {
        setSelectedId(fetchedDirecciones[0].id_direccion);
        onDireccionSeleccionada(fetchedDirecciones[0]);
      } else {
        onDireccionSeleccionada(null);
      }
    } catch (err) {
      setError("No se pudieron cargar las direcciones.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const handleSelect = (direccion: Direccion) => {
    setSelectedId(direccion.id_direccion);
    onDireccionSeleccionada(direccion);
  };

  const handleFormSubmit = async (datos: CrearDireccionData) => {
    setFormLoading(true);
    try {
      const response = await direccionesClienteService.crearDireccion(datos);
      setShowModal(false);
      await cargarDirecciones();
      // Opcional: seleccionar la nueva dirección automáticamente
      handleSelect(response.data);
    } catch (err) {
      console.error("Error al crear la dirección:", err);
      // Aquí se podría mostrar un error en el formulario
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p>Cargando direcciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Elige una dirección de envío</h2>
      <div className="space-y-3">
        {direcciones.map((dir) => (
          <div
            key={dir.id_direccion}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedId === dir.id_direccion
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => handleSelect(dir)}
          >
            <p className="font-bold">
              {dir.etiqueta}{" "}
              {dir.es_principal && (
                <span className="text-xs font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Principal
                </span>
              )}
            </p>
            <p>{dir.direccion}</p>
            <p>
              {dir.ciudad}, {dir.departamento}
            </p>
          </div>
        ))}
      </div>

      {direcciones.length === 0 && (
        <p className="text-gray-500 my-4">
          No tienes direcciones guardadas. ¡Añade una para continuar!
        </p>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Añadir Nueva Dirección
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva Dirección"
      >
        <FormularioDireccionCliente
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default DireccionSelector;
