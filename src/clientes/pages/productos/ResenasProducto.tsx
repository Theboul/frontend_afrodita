import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../../components/ui/Button";
import { ProductoService, type Producto } from "../../../services/productos/ProductoService";
import { resenaService, type Resena } from "../../../services/resenas/resenaService";

export default function ResenasProducto() {
  const { id } = useParams<{ id: string }>();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [productoRes, resenasRes] = await Promise.all([
          ProductoService.obtener(id),
          resenaService.listarPublicas(id),
        ]);
        const productoData = (productoRes as any)?.data ?? (productoRes as any);
        setProducto(productoData);
        setResenas(resenasRes);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "No se pudo cargar el producto o las reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (value: number, size: "sm" | "md" = "md") => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size === "md" ? "h-5 w-5" : "h-4 w-4"} ${
            i <= value ? "text-pink-500 fill-pink-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setMensaje(null);
    setError(null);

    if (calificacion < 1 || calificacion > 5) {
      setError("La calificación debe estar entre 1 y 5.");
      return;
    }
    if (comentario.trim().length < 5) {
      setError("El comentario debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setSubmitting(true);
      const nueva = await resenaService.crear({
        id_producto: id,
        calificacion,
        comentario: comentario.trim(),
      });

      if (nueva.estado === "PUBLICADA") {
        setResenas((prev) => [nueva, ...prev]);
        setMensaje("¡Tu reseña fue publicada!");
      } else {
        setMensaje("Tu reseña fue enviada y quedará pendiente de aprobación.");
      }

      setCalificacion(5);
      setComentario("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "No se pudo enviar la reseña.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF2F6]">
        <div className="animate-spin h-10 w-10 border-4 border-pink-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF2F6]">
      <Header logoSrc="/assets/1.png" />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-pink-200 via-white to-pink-100 rounded-2xl shadow-md p-6 border border-pink-100">
            <p className="text-sm text-gray-600 mb-1">Reseñas</p>
            <h1 className="text-3xl font-bold text-gray-900">
              {producto?.nombre || "Producto"} <span className="text-pink-500">#{id}</span>
            </h1>
            {producto?.descripcion && (
              <p className="text-gray-700 mt-2 max-w-3xl">{producto.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Escribe tu reseña</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Calificación</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={calificacion}
                      onChange={(e) => setCalificacion(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                    <span className="font-semibold text-pink-600">{calificacion}/5</span>
                  </div>
                  {renderStars(calificacion, "sm")}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Comentario</label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comparte tu experiencia con este producto..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
                    required
                    minLength={5}
                  />
                </div>

                {mensaje && (
                  <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-sm">
                    {mensaje}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  label={submitting ? "Enviando..." : "Enviar reseña"}
                  color="primary"
                  type="submit"
                  disabled={submitting}
                  fullWidth
                />
              </form>
            </div>

            {/* Listado */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Opiniones de otros clientes</h2>
                <span className="text-sm text-gray-600">{resenas.length} publicadas</span>
              </div>

              {resenas.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 text-center">
                  <p className="text-gray-700">Aún no hay reseñas publicadas para este producto.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resenas.map((r) => (
                    <div key={r.id_resena} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500">#{r.id_resena}</p>
                          <p className="font-semibold text-gray-900">{r.cliente_nombre}</p>
                        </div>
                        {renderStars(r.calificacion, "sm")}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{r.comentario}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Publicada el {new Date(r.fecha_creacion).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
