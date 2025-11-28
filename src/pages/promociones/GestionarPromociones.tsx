import React, { useEffect, useState } from "react";
import {
  Sparkles,
  PlusCircle,
  RefreshCw,
  Calendar,
  Tag,
  Percent,
  Trash2,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { promocionService, type Promotion, type PromotionCreatePayload, type PromotionType } from "../../services/promociones/promocionService";
import { axiosInstance } from "../../services/axiosConfig";
import LoadingFallback from "../../components/common/LoadingFallback";

interface ProductOption {
  id_producto: string;
  nombre: string;
}

type FieldErrors = Record<string, string | string[]>;

const tipoOptions: { value: PromotionType; label: string; icon: React.ReactNode }[] = [
  { value: "DESCUENTO_PORCENTAJE", label: "Descuento %", icon: <Percent className="w-4 h-4" /> },
  { value: "DESCUENTO_MONTO", label: "Descuento monto", icon: <Tag className="w-4 h-4" /> },
  { value: "COMBO", label: "Combo", icon: <Sparkles className="w-4 h-4" /> },
  { value: "DOS_X_UNO", label: "2x1", icon: <PlusCircle className="w-4 h-4" /> },
];

const emptyForm: PromotionCreatePayload = {
  nombre: "",
  descripcion: "",
  codigo_descuento: "",
  tipo: "DESCUENTO_PORCENTAJE",
  valor_descuento: undefined,
  fecha_inicio: "",
  fecha_fin: "",
  productos: [],
};

const unwrap = (res: any) => {
  if (res && typeof res === "object" && "success" in res && "data" in res) return res.data;
  return res;
};

const GestionarPromociones = () => {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PromotionCreatePayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>("");
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([fetchPromos(), fetchProducts()]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchPromos = async () => {
    try {
      const data = await promocionService.listar();
      setPromos(data);
    } catch (err: any) {
      console.error("Error al listar promociones", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/productos/");
      const raw = unwrap(res);
      const list = Array.isArray(raw?.results) ? raw.results : Array.isArray(raw) ? raw : raw?.results ?? [];
      const options = (list || []).map((p: any) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
      }));
      setProducts(options);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
    setMessage("");
  };

  const handleChange = (field: keyof PromotionCreatePayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const requiresValue = (tipo: PromotionType) =>
    tipo === "DESCUENTO_PORCENTAJE" || tipo === "DESCUENTO_MONTO";

  const parseValor = (): number | null | undefined => {
    if (!requiresValue(form.tipo)) return null;
    if (form.valor_descuento === undefined || form.valor_descuento === null) {
      return undefined;
    }
    const num = Number(form.valor_descuento);
    return Number.isNaN(num) ? undefined : num;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setFieldErrors({});
    setMessage("");
    try {
      const valor = parseValor();

      if (requiresValue(form.tipo) && valor === undefined) {
        setFieldErrors({ valor_descuento: "Ingrese un valor para este tipo" });
        setSubmitting(false);
        return;
      }

      const payload: PromotionCreatePayload = {
        ...form,
        valor_descuento: valor === undefined ? null : valor,
      };

      if (editingId) {
        await promocionService.actualizar(editingId, {
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          codigo_descuento: payload.codigo_descuento,
          tipo: payload.tipo,
          valor_descuento: payload.valor_descuento,
          fecha_inicio: payload.fecha_inicio,
          fecha_fin: payload.fecha_fin,
        });
        setMessage("Promocion actualizada");
      } else {
        await promocionService.crear(payload);
        setMessage("Promocion creada");
      }

      await fetchPromos();
      resetForm();
    } catch (err: any) {
      console.error(err);
      const errors = (err?.errors as FieldErrors) || {};
      setFieldErrors(errors);
      setMessage(err?.message || "No se pudo guardar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id_promocion);
    setForm({
      nombre: promo.nombre || "",
      descripcion: promo.descripcion || "",
      codigo_descuento: promo.codigo_descuento,
      tipo: promo.tipo,
      valor_descuento: promo.valor_descuento ?? undefined,
      fecha_inicio: promo.fecha_inicio,
      fecha_fin: promo.fecha_fin,
      productos: promo.productos.map((p) => p.id_producto),
    });
    setMessage("");
    setFieldErrors({});
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Seguro que deseas eliminar esta promocion?")) return;
    try {
      await promocionService.eliminar(id);
      await fetchPromos();
      if (editingId === id) resetForm();
    } catch (err: any) {
      setMessage(err?.message || "No se pudo eliminar");
    }
  };

  const handleToggleEstado = async (promo: Promotion) => {
    try {
      if (promo.estado === "ACTIVA") {
        await promocionService.desactivar(promo.id_promocion);
      } else {
        await promocionService.activar(promo.id_promocion);
      }
      await fetchPromos();
    } catch (err: any) {
      setMessage(err?.message || "No se pudo cambiar el estado");
    }
  };

  if (loading) return <LoadingFallback />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestionar Promociones</h1>
              <p className="text-gray-600">Crea, activa y controla promociones sin salir del panel.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Limpiar
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Nueva promocion
            </button>
          </div>
        </header>

        {/* Mensaje global */}
        {message && (
          <div className="bg-white border border-pink-200 text-pink-700 px-4 py-3 rounded-xl shadow-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <section className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{editingId ? "Editar promocion" : "Nueva promocion"}</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? `ID ${editingId}` : "Datos basicos"}
                </h2>
              </div>
              {editingId && (
                <span className="px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-700">Productos no editables</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">Nombre</label>
                <input
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Promo verano"
                />
                {fieldErrors.nombre && <p className="text-sm text-red-500">{fieldErrors.nombre}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Codigo</label>
                <input
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={form.codigo_descuento}
                  onChange={(e) => handleChange("codigo_descuento", e.target.value)}
                  placeholder="PROMO10"
                />
                {fieldErrors.codigo_descuento && <p className="text-sm text-red-500">{fieldErrors.codigo_descuento}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Descripcion</label>
                <textarea
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={form.descripcion || ""}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  placeholder="Detalle breve de la promocion"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Tipo</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {tipoOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChange("tipo", opt.value)}
                      type="button"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                        form.tipo === opt.value
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-700 hover:border-pink-200"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={form.valor_descuento ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("valor_descuento", val === "" ? null : Number(val));
                    }}
                    placeholder={form.tipo === "DESCUENTO_PORCENTAJE" ? "Ej: 10 para 10%" : "Ej: 20.5"}
                    disabled={!requiresValue(form.tipo)}
                  />
                  {requiresValue(form.tipo) && fieldErrors.valor_descuento && (
                    <p className="text-sm text-red-500">{fieldErrors.valor_descuento}</p>
                  )}
                  {!requiresValue(form.tipo) && (
                    <p className="text-xs text-gray-500 mt-1">No requerido para combos o 2x1</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Fechas</label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        value={form.fecha_inicio}
                        onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        value={form.fecha_fin}
                        onChange={(e) => handleChange("fecha_fin", e.target.value)}
                      />
                    </div>
                  </div>
                  {(fieldErrors.fecha_inicio || fieldErrors.fecha_fin) && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.fecha_inicio || fieldErrors.fecha_fin}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Productos</label>
                {editingId ? (
                  <p className="text-xs text-gray-500 mt-1">No se pueden editar productos en actualizacion.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {products.map((prod) => {
                      const checked = form.productos.includes(prod.id_producto);
                      return (
                        <label
                          key={prod.id_producto}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
                            checked ? "bg-pink-50 text-pink-700" : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-pink-500"
                            checked={checked}
                            onChange={(e) => {
                              const selected = new Set(form.productos);
                              if (e.target.checked) selected.add(prod.id_producto);
                              else selected.delete(prod.id_producto);
                              handleChange("productos", Array.from(selected));
                            }}
                          />
                          <span className="text-sm">{prod.nombre}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {fieldErrors.productos && <p className="text-sm text-red-500">{fieldErrors.productos}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear promocion"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </section>

          {/* Lista */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Promociones creadas</h2>
              <span className="text-sm text-gray-500">{promos.length} registradas</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {promos.map((promo) => (
                <div
                  key={promo.id_promocion}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center font-semibold">
                        {promo.nombre.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{promo.nombre}</p>
                        <p className="text-sm text-gray-500">Codigo: {promo.codigo_descuento}</p>
                        <p className="text-xs text-gray-500">
                          Vigencia {promo.fecha_inicio} - {promo.fecha_fin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          promo.estado === "ACTIVA" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {promo.estado}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-pink-50 text-pink-700">
                        {promo.tipo}
                      </span>
                      {promo.valor_descuento !== null && (
                        <span className="px-3 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
                          Valor: {promo.valor_descuento}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {promo.productos.map((p) => (
                      <span key={p.id_producto} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border border-gray-200">
                        {p.nombre}
                      </span>
                    ))}
                  </div>

                  {promo.descripcion && <p className="text-sm text-gray-600 mt-2">{promo.descripcion}</p>}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="px-3 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleEstado(promo)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                        promo.estado === "ACTIVA"
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {promo.estado === "ACTIVA" ? (
                        <>
                          <PauseCircle className="w-4 h-4" /> Desactivar
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" /> Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id_promocion)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {promos.length === 0 && (
                <div className="text-center text-gray-500 py-10 border border-dashed border-gray-200 rounded-xl">
                  No hay promociones registradas aun.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GestionarPromociones;
