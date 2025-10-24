import React, { useState, useEffect } from "react";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface Direccion {
  id: number;
  descripcion: string;
}

interface Compra {
  id: number;
  fecha: string;
  total: number;
}

interface DatosCliente {
  cliente: Cliente;
  direcciones: Direccion[];
  compras: Compra[];
}

const GestionarCuentaCliente: React.FC = () => {
  const [clientesDatos, setClientesDatos] = useState<DatosCliente[]>([]);
  const [clienteActual, setClienteActual] = useState<Cliente | null>(null);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState<Partial<Cliente>>({});

  // Simulación de obtención de varios clientes
  useEffect(() => {
    const datos: DatosCliente[] = [
      {
        cliente: { id: 1, nombre: "Tatiana Chávez", correo: "tatiana@example.com", telefono: "+591 70000000" },
        direcciones: [
          { id: 1, descripcion: "Av. Libertador 123" },
          { id: 2, descripcion: "Calle 9 No. 456" }
        ],
        compras: [
          { id: 1, fecha: "2025-09-10", total: 120.5 },
          { id: 2, fecha: "2025-10-01", total: 80.75 }
        ]
      },
      {
        cliente: { id: 2, nombre: "Carlos Pérez", correo: "carlos@example.com", telefono: "+591 70123456" },
        direcciones: [
          { id: 3, descripcion: "Av. Bolivia 789" },
        ],
        compras: [
          { id: 3, fecha: "2025-08-15", total: 200.0 }
        ]
      },
      {
        cliente: { id: 3, nombre: "María López", correo: "maria@example.com", telefono: "+591 70234567" },
        direcciones: [
          { id: 4, descripcion: "Calle Sucre 101" },
        ],
        compras: [
          { id: 4, fecha: "2025-07-20", total: 50.0 },
          { id: 5, fecha: "2025-10-10", total: 75.25 }
        ]
      },
    ];
    setClientesDatos(datos);
    seleccionarCliente(datos[0]);
  }, []);

  const seleccionarCliente = (datos: DatosCliente) => {
    setClienteActual(datos.cliente);
    setDirecciones(datos.direcciones);
    setCompras(datos.compras);
    setModoEdicion(false);
    setDatosEditados(datos.cliente);
  };

  const handleEditar = () => {
    setModoEdicion(true);
    setDatosEditados(clienteActual || {});
  };

  const handleGuardar = () => {
    if (clienteActual) {
      setClienteActual({ ...clienteActual, ...datosEditados });
      // Actualizamos también el array de clientes
      setClientesDatos((prev) =>
        prev.map((c) =>
          c.cliente.id === clienteActual.id ? { ...c, cliente: { ...c.cliente, ...datosEditados } } : c
        )
      );
    }
    setModoEdicion(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-gray-900 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 border border-pink-200">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Gestión de Cuenta del Cliente
        </h1>

        {/* PERFIL */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black border-b border-pink-300 pb-2 mb-4">
            Perfil del Cliente
          </h2>
          {clienteActual && (
            <div className="space-y-2">
              {modoEdicion ? (
                <div className="space-y-3">
                  <input
                    className="w-full border border-pink-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={datosEditados.nombre || ""}
                    onChange={(e) =>
                      setDatosEditados({ ...datosEditados, nombre: e.target.value })
                    }
                  />
                  <input
                    className="w-full border border-pink-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={datosEditados.correo || ""}
                    onChange={(e) =>
                      setDatosEditados({ ...datosEditados, correo: e.target.value })
                    }
                  />
                  <input
                    className="w-full border border-pink-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={datosEditados.telefono || ""}
                    onChange={(e) =>
                      setDatosEditados({ ...datosEditados, telefono: e.target.value })
                    }
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                      onClick={handleGuardar}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                      onClick={() => setModoEdicion(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Nombre:</strong> {clienteActual.nombre}</p>
                  <p><strong>Correo:</strong> {clienteActual.correo}</p>
                  <p><strong>Teléfono:</strong> {clienteActual.telefono}</p>
                  <button
                    className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                    onClick={handleEditar}
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* DIRECCIONES */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black border-b border-pink-300 pb-2 mb-4">
            Direcciones
          </h2>
          <ul className="space-y-2">
            {direcciones.map((dir) => (
              <li
                key={dir.id}
                className="p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition"
              >
                {dir.descripcion}
              </li>
            ))}
          </ul>
        </section>

        {/* HISTORIAL DE COMPRAS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black border-b border-pink-300 pb-2 mb-4">
            Historial de Compras
          </h2>
          <ul className="space-y-2">
            {compras.map((compra) => (
              <li
                key={compra.id}
                className="flex justify-between items-center p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition"
              >
                <span>
                  <strong>Fecha:</strong> {compra.fecha}
                </span>
                <span className="text-pink-700 font-semibold">
                  Total: ${compra.total.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* LISTA DE CLIENTES */}
<section>
  <h2 className="text-xl font-semibold text-black border-b border-pink-300 pb-2 mb-4">
    Otros Clientes
  </h2>
  <ul className="space-y-2">
    {clientesDatos.map((c) => (
      <li
        key={c.cliente.id}
        className={`cursor-pointer p-3 rounded-lg border border-pink-200 hover:bg-pink-100 transition ${
          clienteActual?.id === c.cliente.id ? "bg-pink-200 font-semibold" : "bg-pink-50"
        }`}
        onClick={() => seleccionarCliente(c)}
      >
        <span className="mr-2 font-semibold">ID: {c.cliente.id}</span>
        <span>{c.cliente.nombre}</span>
      </li>
    ))}
  </ul>
</section>
      </div>
    </div>
  );
};

export default GestionarCuentaCliente;
