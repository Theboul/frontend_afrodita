import React, { useState } from "react";

interface Compra {
  id_compra: number;
  fecha: string;
  monto_total: number;
  estado: string;
  cod_proveedor: string;
}

type NuevaCompra = {
  id_compra?: number | ""; // opcional: si se deja vacío se autogenera
  fecha: string;
  monto_total: number | "";
  estado: string;
  cod_proveedor: string;
};

const GestionarCompra: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<NuevaCompra>({
    id_compra: "",
    fecha: "",
    monto_total: "",
    estado: "",
    cod_proveedor: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // parseamos numéricos solo donde corresponde
    if (name === "monto_total") {
      setNuevaCompra({ ...nuevaCompra, [name]: value === "" ? "" : parseFloat(value) });
    } else if (name === "id_compra") {
      setNuevaCompra({ ...nuevaCompra, [name]: value === "" ? "" : parseInt(value, 10) });
    } else {
      setNuevaCompra({ ...nuevaCompra, [name]: value });
    }
  };

  const agregarCompra = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nuevaCompra.fecha || nuevaCompra.monto_total === "" || !nuevaCompra.estado || !nuevaCompra.cod_proveedor) {
      alert("Completa todos los campos (puedes dejar vacío el ID para autogenerarlo).");
      return;
    }

    // Generar ID si no fue proporcionado
    const idGenerado =
      nuevaCompra.id_compra === "" || nuevaCompra.id_compra === undefined
        ? generarIdLibre()
        : (nuevaCompra.id_compra as number);

    const compra: Compra = {
      id_compra: idGenerado,
      fecha: nuevaCompra.fecha,
      monto_total: Number(nuevaCompra.monto_total),
      estado: nuevaCompra.estado,
      cod_proveedor: nuevaCompra.cod_proveedor,
    };

    setCompras((prev) => [...prev, compra]);
    // reset
    setNuevaCompra({
      id_compra: "",
      fecha: "",
      monto_total: "",
      estado: "",
      cod_proveedor: "",
    });
  };

  // función simple para generar un id único (busca el máximo y suma 1)
  const generarIdLibre = () => {
    if (compras.length === 0) return 1;
    const maxId = compras.reduce((max, c) => (c.id_compra > max ? c.id_compra : max), compras[0].id_compra);
    return maxId + 1;
  };

  // Eliminar compra (útil en pantallas pequeñas para probar)
  const eliminarCompra = (id: number) => {
    if (!confirm("¿Eliminar esta compra?")) return;
    setCompras((prev) => prev.filter((c) => c.id_compra !== id));
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6 text-center">
        Gestión de Compras
      </h1>

      {/* Formulario de compra */}
      <form
        onSubmit={agregarCompra}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-md max-w-3xl mx-auto mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">ID (opcional)</label>
            <input
              type="number"
              name="id_compra"
              value={nuevaCompra.id_compra ?? ""}
              onChange={handleChange}
              placeholder="Dejar vacío para autogenerar"
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={nuevaCompra.fecha}
              onChange={handleChange}
              required
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">Monto Total</label>
            <input
              type="number"
              name="monto_total"
              step="0.01"
              value={nuevaCompra.monto_total === "" ? "" : String(nuevaCompra.monto_total)}
              onChange={handleChange}
              required
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold mb-1 text-pink-700">Estado</label>
            <input
              type="text"
              name="estado"
              value={nuevaCompra.estado}
              onChange={handleChange}
              placeholder="Ej: pagado, pendiente..."
              required
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-pink-700">Código del Proveedor</label>
            <input
              type="text"
              name="cod_proveedor"
              value={nuevaCompra.cod_proveedor}
              onChange={handleChange}
              required
              className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full md:w-auto md:px-8 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg transition"
        >
          Registrar Compra
        </button>
      </form>

      {/* Lista / Tabla de compras */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold text-pink-700 mb-4 text-center">Lista de Compras</h2>
        {compras.length === 0 ? (
          <p className="text-center text-gray-500">No hay compras registradas aún.</p>
        ) : (
          <>
            {/* Tabla visible en md y arriba */}
            <div className="hidden md:block bg-white rounded-2xl shadow p-4">
              <table className="w-full border-collapse">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="border border-pink-300 px-3 py-2 text-left">ID</th>
                    <th className="border border-pink-300 px-3 py-2 text-left">Fecha</th>
                    <th className="border border-pink-300 px-3 py-2 text-right">Monto Total</th>
                    <th className="border border-pink-300 px-3 py-2 text-left">Estado</th>
                    <th className="border border-pink-300 px-3 py-2 text-left">Código Proveedor</th>
                    <th className="border border-pink-300 px-3 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((compra) => (
                    <tr key={compra.id_compra} className="hover:bg-pink-50 transition">
                      <td className="border border-pink-200 px-3 py-2">{compra.id_compra}</td>
                      <td className="border border-pink-200 px-3 py-2">{compra.fecha}</td>
                      <td className="border border-pink-200 px-3 py-2 text-right">${compra.monto_total.toFixed(2)}</td>
                      <td className="border border-pink-200 px-3 py-2">{compra.estado}</td>
                      <td className="border border-pink-200 px-3 py-2">{compra.cod_proveedor}</td>
                      <td className="border border-pink-200 px-3 py-2 text-center">
                        <button
                          onClick={() => eliminarCompra(compra.id_compra)}
                          className="text-sm px-2 py-1 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards para pantallas pequeñas */}
            <div className="md:hidden space-y-3">
              {compras.map((compra) => (
                <div key={compra.id_compra} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500">ID</div>
                      <div className="font-semibold text-black">{compra.id_compra}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Fecha</div>
                      <div className="font-semibold">{compra.fecha}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-gray-500">Monto</div>
                      <div className="font-semibold">${compra.monto_total.toFixed(2)}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Estado</div>
                      <div className="font-semibold">{compra.estado}</div>
                    </div>

                    <div className="col-span-2 mt-1">
                      <div className="text-sm text-gray-500">Proveedor</div>
                      <div className="font-semibold">{compra.cod_proveedor}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => eliminarCompra(compra.id_compra)}
                      className="flex-1 text-sm px-3 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GestionarCompra;
