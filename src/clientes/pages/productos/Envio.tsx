import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import DatosPersonales from "../../components/DatosPersonales";
import { useNavigate } from "react-router-dom";

import {
  getDireccionesCliente,
  getTiposEnvio,
  getPerfilCliente,
  crearEnvio,
  crearDireccionCliente,
  type DireccionCliente,
  type TipoEnvio,
  type EnvioPayload
} from "../../services/envioService";

interface Usuario {
  nombre_completo: string;
  correo: string;
  telefono: string;
}

export default function Envio() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [tiposEnvio, setTiposEnvio] = useState<TipoEnvio[]>([]);
  const [direcciones, setDirecciones] = useState<DireccionCliente[]>([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cod_tipo_envio: "",
    id_direccion: "",
  });

  const [formDireccion, setFormDireccion] = useState({
    etiqueta: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    referencia: "",
  });

  useEffect(() => {
    getPerfilCliente().then((res) => {
      if (res?.data?.perfil) {
        setUsuario(res.data.perfil);
      }
    });

    getTiposEnvio().then((data) => {
      setTiposEnvio(data);
    });

    getDireccionesCliente().then((data) => {
      setDirecciones(data);

      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          id_direccion: String(data[0].id_direccion),
        }));
      }
    });
  }, []);

  const handleRegistrarDireccion = async (e: any) => {
    e.preventDefault();

    if (!formDireccion.etiqueta || !formDireccion.direccion || !formDireccion.ciudad || !formDireccion.departamento) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await crearDireccionCliente(formDireccion);

      alert("Dirección registrada correctamente");

      const nuevasDirecciones = await getDireccionesCliente();
      setDirecciones(nuevasDirecciones);

      if (nuevasDirecciones.length > 0) {
        setForm((prev) => ({
          ...prev,
          id_direccion: String(nuevasDirecciones[0].id_direccion),
        }));
      }

    } catch {
      alert("Error al registrar dirección");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.cod_tipo_envio || !form.id_direccion) {
      alert("Debe seleccionar una dirección y un tipo de envío.");
      return;
    }

    const fecha = new Date().toISOString().split("T")[0];

    const payload: EnvioPayload = {
      fecha_envio: fecha,
      costo: 0,
      estado_envio: "EN_PREPARACION",
      cod_tipo_envio: Number(form.cod_tipo_envio),
      id_direccion: Number(form.id_direccion),
    };

    try {
      await crearEnvio(payload);
      alert("Envío registrado correctamente");
      setForm({ cod_tipo_envio: "", id_direccion: "" });
    } catch {
      alert("Error al registrar el envío");
    }
  };

  return (
    <div className="">
      <Header />

     <main className="flex-1 w-full px-4 sm:px-6 lg:px-11 mt-20">
        {/* TABS – RESPONSIVE */}
        <div className="w-full flex justify-center mt-16 md:mt-20 lg:mt-32 mb-10 md:mb-16">
          <div className="flex border-b border-gray-400 w-full max-w-xl sm:max-w-2xl justify-around text-center">

            <button
              onClick={() => navigate("/carrito-cliente")}
               className="px-3 sm:px-6 py-2 font-semibold text-base sm:text-lg 
              text-gray-500 hover:text-purple-600 w-1/2
              border-b-4 border-transparent hover:border-purple-300 transition"
            >
              Carrito
            </button>

            <button
              onClick={() => navigate("/envio-cliente")}
             className="px-3 sm:px-6 py-2 font-semibold text-base sm:text-lg 
              border-b-4 transition border-purple-600 text-purple-600 w-1/2"
            >
              Información
            </button>

          </div>
        </div>

        {/* CUERPO */}
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto bg-white shadow p-6 sm:p-8 rounded">

          {usuario ? (
            <DatosPersonales
              nombre={usuario.nombre_completo}
              correo={usuario.correo}
              telefono={usuario.telefono}
            />
          ) : (
            <p className="text-center text-gray-500 mb-6">
              Cargando datos personales...
            </p>
          )}

          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">
            Dirección de Envío
          </h2>

          {/* SELECT DIRECCIONES */}
          {direcciones.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Dirección Registrada *
              </label>
              <select
                className="w-full p-3 border rounded"
                value={form.id_direccion}
                onChange={(e) => setForm({ ...form, id_direccion: e.target.value })}
              >
                <option value="">Seleccione</option>
                {direcciones.map((d) => (
                  <option key={d.id_direccion} value={d.id_direccion}>
                    {d.etiqueta} - {d.direccion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* SELECT ENVÍO */}
          {tiposEnvio.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Tipo de Envío *
              </label>
              <select
                className="w-full p-3 border rounded"
                value={form.cod_tipo_envio}
                onChange={(e) => setForm({ ...form, cod_tipo_envio: e.target.value })}
              >
                <option value="">Seleccione</option>
                {tiposEnvio.map((t) => (
                  <option key={t.cod_tipo_envio} value={t.cod_tipo_envio}>
                    {t.tipo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* BOTÓN REGISTRAR */}
          {direcciones.length > 0 && tiposEnvio.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full bg-pink-600 text-white p-3 rounded text-lg font-medium hover:bg-pink-700 transition mb-10"
            >
              Registrar Envío
            </button>
          )}

          {/* FORM AGREGAR DIRECCIÓN */}
          <div className="border-t pt-8 mt-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
              Agregar Nueva Dirección
            </h3>

            <form onSubmit={handleRegistrarDireccion} className="space-y-4">
              <input
                type="text"
                placeholder="Etiqueta (Casa, trabajo, etc.)"
                className="w-full p-3 border rounded"
                value={formDireccion.etiqueta}
                onChange={(e) => setFormDireccion({ ...formDireccion, etiqueta: e.target.value })}
              />

              <input
                type="text"
                placeholder="Dirección"
                className="w-full p-3 border rounded"
                value={formDireccion.direccion}
                onChange={(e) => setFormDireccion({ ...formDireccion, direccion: e.target.value })}
              />

              <input
                type="text"
                placeholder="Ciudad / Municipio / Provincia"
                className="w-full p-3 border rounded"
                value={formDireccion.ciudad}
                onChange={(e) => setFormDireccion({ ...formDireccion, ciudad: e.target.value })}
              />

              <input
                type="text"
                placeholder="Departamento"
                className="w-full p-3 border rounded"
                value={formDireccion.departamento}
                onChange={(e) => setFormDireccion({ ...formDireccion, departamento: e.target.value })}
              />

              <textarea
                placeholder="Referencia (Opcional)"
                className="w-full p-3 border rounded"
                value={formDireccion.referencia}
                onChange={(e) => setFormDireccion({ ...formDireccion, referencia: e.target.value })}
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded text-lg font-medium hover:bg-blue-700 transition"
              >
                Guardar Dirección
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
