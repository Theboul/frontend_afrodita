import { useEffect, useMemo, useState } from "react";
import { Star, Filter, RefreshCw, Eye, EyeOff, XCircle, CheckCircle2, Trash2 } from "lucide-react";
import ModuleLayout from "../../layouts/ModuleLayout";
import LoadingFallback from "../../components/common/LoadingFallback";
import Button from "../../components/ui/Button";
import { axiosInstance } from "../../services/axiosConfig";
import { resenaService, type Resena, type ReviewStatus } from "../../services/resenas/resenaService";

type ProductoOption = {
  id_producto: string;
  nombre: string;
};

type Mensaje = { tipo: "ok" | "error"; texto: string } | null;

const estados: { value: ReviewStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PUBLICADA", label: "Publicada" },
  { value: "RECHAZADA", label: "Rechazada" },
  { value: "OCULTA", label: "Oculta" },
];

const estadoStyles: Record<ReviewStatus, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  PUBLICADA: "bg-green-100 text-green-700 border border-green-200",
  RECHAZADA: "bg-red-100 text-red-700 border border-red-200",
  OCULTA: "bg-gray-200 text-gray-700 border border-gray-300",
};

const unwrap = (res: any) => {
  if (res && typeof res === "object" && "success" in res && "data" in res) return res.data;
  if (res && typeof res === "object" && "data" in res) return res.data;
  return res;
};

export default function GestionarResenas() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<Mensaje>(null);
  const [filtros, setFiltros] = useState<{ estado: ReviewStatus | ""; producto: string }>({
    estado: "",
    producto: "",
  });
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  useEffect(() => {
    cargarProductos();
    cargarResenas();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axiosInstance.get("/api/productos/");
      const raw = unwrap(res);
      const list = Array.isArray(raw?.results) ? raw.results : Array.isArray(raw) ? raw : [];
      const options = list.map((p: any) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
      }));
      setProductos(options);
    } catch (err) {
      // Silenciamos error: es solo para el selector
      console.error("No se pudieron cargar productos", err);
    }
  };

  const cargarResenas = async () => {
    setLoading(true);
    setMensaje(null);
    try {
      const data = await resenaService.listarAdmin({
        estado: filtros.estado || undefined,
        producto: filtros.producto || undefined,
      });
      setResenas(data);
    } catch (err: any) {
      console.error(err);
      setMensaje({ tipo: "error", texto: err?.message || "No se pudieron cargar las reseñas" });
    } finally {
      setLoading(false);
    }
  };

  const estadoResumen = useMemo(() => {
    return resenas.reduce<Record<ReviewStatus, number>>(
      (acc, r) => {
        acc[r.estado] = (acc[r.estado] || 0) + 1;
        return acc;
      },
      { PENDIENTE: 0, PUBLICADA: 0, RECHAZADA: 0, OCULTA: 0 }
    );
  }, [resenas]);

  const actualizarEnLista = (resena: Resena) => {
    setResenas((prev) => prev.map((r) => (r.id_resena === resena.id_resena ? resena : r)));
  };

  const eliminarDeLista = (id: number) => {
    setResenas((prev) => prev.filter((r) => r.id_resena !== id));
  };

  const ejecutarAccion = async (
    id: number,
    accion: "publicar" | "rechazar" | "ocultar" | "eliminar"
  ) => {
    setProcesandoId(id);
    setMensaje(null);
    try {
      if (accion === "eliminar") {
        const confirmar = confirm("¿Eliminar la reseña? Esta acción es definitiva.");
        if (!confirmar) {
          setProcesandoId(null);
          return;
        }
        await resenaService.eliminar(id);
        eliminarDeLista(id);
        setMensaje({ tipo: "ok", texto: "Reseña eliminada." });
        return;
      }

      const accionMap = {
        publicar: resenaService.publicar,
        rechazar: resenaService.rechazar,
        ocultar: resenaService.ocultar,
      } as const;

      const updated = await accionMap[accion](id);
      actualizarEnLista(updated);

      const mensajesAccion: Record<"publicar" | "rechazar" | "ocultar", string> = {
        publicar: "Reseña publicada",
        rechazar: "Reseña rechazada",
        ocultar: "Reseña ocultada",
      };
      setMensaje({ tipo: "ok", texto: mensajesAccion[accion] });
    } catch (err: any) {
      console.error(err);
      setMensaje({ tipo: "error", texto: err?.message || "No se pudo completar la acción" });
    } finally {
      setProcesandoId(null);
    }
  };

  const resetFiltros = () => {
    setFiltros({ estado: "", producto: "" });
    cargarResenas();
  };

  const renderStars = (value: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= value ? "text-pink-500 fill-pink-500" : "text-gray-300"}`} />
      ))}
      <span className="text-sm text-gray-600 ml-1">{value}/5</span>
    </div>
  );

  if (loading) return <LoadingFallback />;

  return (
    <ModuleLayout title="Gestionar Reseñas de Productos">
      <div className="space-y-6">
        {/* Resumen de estados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["PENDIENTE", "PUBLICADA", "RECHAZADA", "OCULTA"] as ReviewStatus[]).map((estado) => (
            <div key={estado} className="bg-white rounded-lg shadow p-4 border border-pink-100">
              <p className="text-sm text-gray-500">{estado}</p>
              <p className="text-3xl font-bold text-pink-600">{estadoResumen[estado] || 0}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <form
            className="flex flex-col md:flex-row gap-4 md:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              cargarResenas();
            }}
          >
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-sm font-semibold text-gray-700 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, estado: e.target.value as ReviewStatus | "" }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                {estados.map((op) => (
                  <option key={op.value || "all"} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-sm font-semibold text-gray-700 mb-1">Producto</label>
              <select
                value={filtros.producto}
                onChange={(e) => setFiltros((prev) => ({ ...prev, producto: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Todos</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                label="Aplicar filtros"
                icon={<Filter className="h-4 w-4" />}
                color="primary"
                type="submit"
              />
              <Button
                label="Resetear"
                icon={<RefreshCw className="h-4 w-4" />}
                color="warning"
                onClick={resetFiltros}
              />
            </div>
          </form>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div
            className={`rounded-lg px-4 py-3 border ${
              mensaje.tipo === "ok"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Tabla / Cards */}
        {resenas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No hay reseñas que coincidan con el filtro.</p>
          </div>
        ) : (
          <>
            {/* Tabla escritorio */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-pink-200 text-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Calificación</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resenas.map((r) => (
                    <tr key={r.id_resena} className="hover:bg-pink-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">#{r.id_resena}</td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{r.producto_nombre}</div>
                        <div className="text-xs text-gray-500">{r.producto_id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{r.cliente_nombre}</div>
                        <div className="text-xs text-gray-500">ID: {r.cliente_id}</div>
                      </td>
                      <td className="px-4 py-3">{renderStars(r.calificacion)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoStyles[r.estado]}`}>
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(r.fecha_creacion).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center flex-wrap gap-2">
                          {(r.estado === "PENDIENTE" || r.estado === "OCULTA") && (
                            <Button
                              label="Publicar"
                              color="success"
                              icon={<CheckCircle2 className="h-4 w-4" />}
                              disabled={procesandoId === r.id_resena}
                              onClick={() => ejecutarAccion(r.id_resena, "publicar")}
                            />
                          )}
                          {r.estado === "PENDIENTE" && (
                            <Button
                              label="Rechazar"
                              color="danger"
                              icon={<XCircle className="h-4 w-4" />}
                              disabled={procesandoId === r.id_resena}
                              onClick={() => ejecutarAccion(r.id_resena, "rechazar")}
                            />
                          )}
                          {r.estado === "PUBLICADA" && (
                            <Button
                              label="Ocultar"
                              color="warning"
                              icon={<EyeOff className="h-4 w-4" />}
                              disabled={procesandoId === r.id_resena}
                              onClick={() => ejecutarAccion(r.id_resena, "ocultar")}
                            />
                          )}
                          <Button
                            label="Eliminar"
                            color="danger"
                            icon={<Trash2 className="h-4 w-4" />}
                            disabled={procesandoId === r.id_resena}
                            onClick={() => ejecutarAccion(r.id_resena, "eliminar")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-4">
              {resenas.map((r) => (
                <div key={r.id_resena} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">#{r.id_resena}</p>
                      <p className="text-lg font-semibold text-gray-900">{r.producto_nombre}</p>
                      <p className="text-xs text-gray-500">{r.producto_id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoStyles[r.estado]}`}>
                      {r.estado}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Cliente:</span>
                      <span>{r.cliente_nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Calificación:</span>
                      {renderStars(r.calificacion)}
                    </div>
                    <div>
                      <p className="font-semibold">Comentario</p>
                      <p className="text-gray-700 leading-relaxed">{r.comentario}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(r.fecha_creacion).toLocaleString("es-ES")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {(r.estado === "PENDIENTE" || r.estado === "OCULTA") && (
                      <Button
                        label="Publicar"
                        color="success"
                        icon={<Eye className="h-4 w-4" />}
                        disabled={procesandoId === r.id_resena}
                        onClick={() => ejecutarAccion(r.id_resena, "publicar")}
                        fullWidth
                      />
                    )}
                    {r.estado === "PENDIENTE" && (
                      <Button
                        label="Rechazar"
                        color="danger"
                        icon={<XCircle className="h-4 w-4" />}
                        disabled={procesandoId === r.id_resena}
                        onClick={() => ejecutarAccion(r.id_resena, "rechazar")}
                        fullWidth
                      />
                    )}
                    {r.estado === "PUBLICADA" && (
                      <Button
                        label="Ocultar"
                        color="warning"
                        icon={<EyeOff className="h-4 w-4" />}
                        disabled={procesandoId === r.id_resena}
                        onClick={() => ejecutarAccion(r.id_resena, "ocultar")}
                        fullWidth
                      />
                    )}
                    <Button
                      label="Eliminar"
                      color="danger"
                      icon={<Trash2 className="h-4 w-4" />}
                      disabled={procesandoId === r.id_resena}
                      onClick={() => ejecutarAccion(r.id_resena, "eliminar")}
                      fullWidth
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
