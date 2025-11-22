import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ventasService } from "../../services/ventas/ventasService";
import LoadingFallback from "../../components/common/LoadingFallback";

export default function NotaVenta() {
  const { id } = useParams();
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID RECIBIDO:", id);

    ventasService.obtenerVenta(Number(id))
      .then((ventaReal) => {     
        console.log("VENTA RECIBIDA:", ventaReal);
        setVenta(ventaReal);
      })
      .catch(e => console.error("ERROR:", e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingFallback />;

  if (!venta)
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        No se encontró la venta.
      </div>
    );

  const formatFecha = (f: string) => {
    try {
      const d = new Date(f);
      return d.toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return f;
    }
  };

  return (
    <div className="flex justify-center py-10 print:py-0">
      <div className="w-[700px] bg-white shadow-lg rounded-xl border border-pink-200 p-8 relative print:shadow-none print:border-none">

        {/* ESTADO ANULADA */}
        {venta.estado === "ANULADA" && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded text-sm font-bold rotate-[-8deg]">
            VENTA ANULADA
          </div>
        )}

        {/* ENCABEZADO */}
        <div className="text-center mb-6">
          {/* LOGO */}
          <img
            src="/assets/1.png"
            alt="Logo Afrodita"
            className="w-28 mx-auto mb-3 print:hidden"
          />

          <h1 className="text-3xl font-bold text-pink-600">Nota de Venta</h1>
          <p className="text-sm text-gray-500">
            Afrodita — Venta de Lentes de Contacto
          </p>
        </div>

        {/* INFO PRINCIPAL */}
        <div className="grid grid-cols-2 gap-4 bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <div>
            <p><span className="font-semibold">N° Venta:</span> {venta.id_venta}</p>
            <p><span className="font-semibold">Fecha:</span> {formatFecha(venta.fecha)}</p>
            <p><span className="font-semibold">Estado:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  venta.estado === "PENDIENTE"
                    ? "bg-yellow-500"
                    : venta.estado === "ANULADA"
                    ? "bg-red-500"
                    : "bg-green-600"
                }`}
              >
                {venta.estado}
              </span>
            </p>
          </div>

          <div>
            <p><span className="font-semibold">Cliente:</span> {venta.cliente_nombre}</p>
            <p><span className="font-semibold">Vendedor:</span> {venta.vendedor_nombre}</p>
            <p><span className="font-semibold">Método de Pago:</span> {venta.metodo_pago_tipo}</p>
          </div>
        </div>

        {/* DETALLE DE PRODUCTOS */}
        <table className="w-full border border-gray-300 rounded-lg mb-6">
          <thead className="bg-pink-100 text-gray-700">
            <tr>
              <th className="py-2 border px-3">Producto</th>
              <th className="py-2 border px-3">Cant.</th>
              <th className="py-2 border px-3">Precio</th>
              <th className="py-2 border px-3">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {venta.detalles.map((det: any, idx: number) => (
              <tr key={idx} className="text-center odd:bg-gray-50">
                <td className="py-2 border px-3">{det.nombre_producto}</td>
                <td className="py-2 border px-3">{det.cantidad}</td>
                <td className="py-2 border px-3">Bs {Number(det.precio).toFixed(2)}</td>
                <td className="py-2 border px-3">Bs {Number(det.sub_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="text-right mb-6">
          <span className="font-bold text-2xl text-pink-600">
            Total: Bs {Number(venta.monto_total).toFixed(2)}
          </span>
        </div>

        {/* BOTONES */}
        <div className="flex justify-between print:hidden">
          <Link
            to="/ventas"
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Volver
          </Link>

          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-medium shadow"
          >
            Imprimir Nota
          </button>
        </div>
      </div>
    </div>
  );
}
