import { useState } from "react";
import { crearDevolucion } from "../../services/devoluciones/devolucionesService";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const FormularioDevolucionCliente = () => {
  const navigate = useNavigate();
  const { id_compra } = useParams();

  const [motivo, setMotivo] = useState("");
  const [monto, setMonto] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      compra: id_compra,
      motivo_general: motivo,
      monto_total: monto,
      fecha_devolucion: new Date().toISOString().slice(0, 10),
    };

    const resp = await crearDevolucion(data);

    if (resp) {
      Swal.fire("Enviado", "La solicitud fue creada", "success");
      navigate("/mis-devoluciones");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Solicitar devolución</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-semibold">Motivo</label>
          <textarea
            className="w-full border p-2"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Monto a reembolsar</label>
          <input
            type="number"
            className="w-full border p-2"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default FormularioDevolucionCliente;
