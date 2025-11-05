import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { userService } from "../../../services/cliente/userService";
import { type UserData } from "../../../services/auth/authService";
import toast from "react-hot-toast";

export default function PerfilInfo() {
  const [usuario, setUsuario] = useState<UserData | null>(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre_completo: "",
    telefono: "",
    sexo: "",
  });

  // Cargar usuario autenticado
  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const user = await userService.obtenerPerfil();
      setUsuario(user);
      setForm({
        nombre_completo: user.nombre_completo || "",
        telefono: user.telefono || "",
        sexo: user.sexo || "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      toast.error("Error al cargar información del perfil");
    }
  };

  const handleGuardar = async () => {
    if (!usuario) return;
    setLoading(true);
    try {
      const updatedUser = await userService.actualizarPerfil(form);
      toast.success("Perfil actualizado correctamente ✅");
      setUsuario(updatedUser);
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el perfil ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Cargando información...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información Personal</h2>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Nombre completo */}
          <div>
            <p className="text-sm text-gray-500">Nombre Completo</p>
            {editando ? (
              <input
                type="text"
                value={form.nombre_completo}
                onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <p className="font-medium text-gray-900">{usuario.nombre_completo}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <p className="text-sm text-gray-500">Correo Electrónico</p>
            <p className="font-medium text-gray-900">{usuario.correo || usuario.email}</p>
          </div>

          {/* Teléfono */}
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            {editando ? (
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <p className="font-medium text-gray-900">{usuario.telefono || "—"}</p>
            )}
          </div>

          {/* Sexo */}
          <div>
            <p className="text-sm text-gray-500">Sexo</p>
            {editando ? (
              <select
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option value="">Seleccionar...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            ) : (
              <p className="font-medium text-gray-900">{usuario.sexo || "—"}</p>
            )}
          </div>

          {/* Fecha registro */}
          <div>
            <p className="text-sm text-gray-500">Fecha de Registro</p>
            <p className="font-medium text-gray-900">
              {usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString("es-ES") : "—"}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-2">
          {editando ? (
            <>
              <Button
                label="Cancelar"
                color="info"
                onClick={() => {
                  setEditando(false);
                  setForm({
                    nombre_completo: usuario.nombre_completo || "",
                    telefono: usuario.telefono || "",
                    sexo: usuario.sexo || "",
                  });
                }}
              />
              <Button
                label={loading ? "Guardando..." : "Guardar Cambios"}
                color="primary"
                onClick={handleGuardar}
                disabled={loading}
              />
            </>
          ) : (
            <Button label="Editar Información" color="primary" onClick={() => setEditando(true)} />
          )}
        </div>
      </Card>
    </div>
  );
}
