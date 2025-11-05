import React, { useEffect, useState } from "react";
import { useCarritoStore } from "../../stores/useCarritoStore";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";
import StripePaymentModal from "../../../components/ventas/StripePaymentModal";
import { paymentService } from "../../../services/ventas/paymentService";

const Carrito: React.FC = () => {
  const {
    productos,
    cargarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
  } = useCarritoStore();

  const [loading, setLoading] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stripeOpen, setStripeOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [idVentaTmp, setIdVentaTmp] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await cargarCarrito();
      setLoading(false);
    };
    init();
  }, []);

  const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  const handleAumentar = async (prod: any) => {
    if (prod.cantidad >= prod.stock) {
      setErrorStock("No hay más stock disponible");
      return;
    }
    setErrorStock(null);
    await aumentarCantidad(prod.id);
  };

  const pagarAhora = async () => {
    try {
      setError(null);
      if (total <= 0) {
        setError("El total debe ser mayor a 0");
        return;
      }
      setLoading(true);
      // Usar la view que ya tienes: create_payment_intent (amount en centavos)
      const cents = Math.round(total * 100);
      const currency = (import.meta.env.VITE_STRIPE_CURRENCY || 'usd').toLowerCase();
      const r = await paymentService.createPaymentIntentSimple(cents, currency);
      setClientSecret(r.clientSecret);
      setStripeOpen(true);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo iniciar el pago con Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 mt-10">
      <h1 className="text-2xl font-bold mb-6">🛒 Mi Carrito</h1>
      <h1 className="text-2xl font-bold mb-6">🛒 Mi Carrito</h1>
        {loading ? (
          <p>Cargando carrito...</p>
        ) : productos.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
                  <h2 className="font-semibold text-lg">{prod.nombre}</h2>
                  {prod.descripcion && (
                    <p className="text-gray-500 text-sm">{prod.descripcion}</p>
                  )}
                  <p className="font-bold mt-1">Bs {prod.precio.toFixed(2)}</p>

                  {errorStock && <p className="text-red-500 text-sm">{errorStock}</p>}

                  <div className="flex items-center justify-center sm:justify-start mt-2 space-x-2">
                    <button
                      onClick={() => disminuirCantidad(prod.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-2">{prod.cantidad}</span>
                    <button
                      onClick={() => handleAumentar(prod)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>

                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
  
            <div className="mt-6 text-right font-bold text-xl">
              Total: Bs {total.toFixed(2)}
          </div>
            <div className="mt-2 text-right text-sm text-red-600">{error}</div>
            <div className="mt-6 flex justify-end">
              <button onClick={pagarAhora} disabled={loading} className="w-full sm:w-auto px-6 py-3 bg-pink-600 text-white font-bold text-xl rounded-lg shadow hover:bg-pink-700 transition disabled:opacity-50">
                {loading ? 'Iniciando...' : 'Pagar Ahora'}
              </button>
            </div>

            
          </div>
        )}
      </main>
      <StripePaymentModal open={stripeOpen} clientSecret={clientSecret} onClose={() => setStripeOpen(false)} onSucceeded={() => { /* opcional: refrescar resumen */ }} />
      <Footer />
    </div>
  );
};

export default Carrito;
