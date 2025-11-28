// src/clientes/pages/productos/ProcesoPago.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DireccionSelector from "../../components/direcciones/DireccionSelector";
import type { Direccion } from "../../../services/cliente/direccionesClienteService";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { useCarritoStore } from "../../stores/useCarritoStore";
import { ventaClienteService } from "../../../services/cliente/ventaClienteService";

const ProcesoPago: React.FC = () => {
  const navigate = useNavigate();
  const [direccionSeleccionada, setDireccionSeleccionada] =
    useState<Direccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { total, productos } = useCarritoStore();

  const handleDireccionSeleccionada = (direccion: Direccion | null) => {
    setDireccionSeleccionada(direccion);
  };

  const handlePagar = async () => {
    if (!direccionSeleccionada) {
      setError("Por favor, selecciona una dirección de envío.");
      return;
    }
    if (productos.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      console.log("🔵 [DEBUG] Iniciando proceso de pago...");
      console.log("🔵 [DEBUG] Dirección seleccionada:", direccionSeleccionada);
      console.log("🔵 [DEBUG] Productos en el carrito:", productos);

      // Preparar los datos
      const productosParaVenta = productos.map(p => ({
        id_producto: p.id,
        cantidad: p.cantidad,
      }));

      const datosParaBackend = {
        id_direccion: direccionSeleccionada.id_direccion,
        productos: productosParaVenta,
      };

      console.log("📦 [DEBUG] Datos que se enviarán al backend:", JSON.stringify(datosParaBackend, null, 2));

      // Llamar al servicio para crear la venta
      const stripeResponse = await ventaClienteService.crearVentaOnline(datosParaBackend);

      console.log("💳 [DEBUG] Respuesta completa del servicio:", stripeResponse);

      // Verificar que tengamos el client_secret
      if (!stripeResponse || !stripeResponse.client_secret) {
        console.error("🔴 [ERROR] Respuesta del backend sin client_secret:", stripeResponse);
        setError("No se pudo obtener el token de pago. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      console.log("✅ [DEBUG] client_secret obtenido:", stripeResponse.client_secret);
      console.log("✅ [DEBUG] ID de venta:", stripeResponse.id_venta);
      console.log("✅ [DEBUG] Referencia:", stripeResponse.reference);

      // Redirigir a la página de Stripe Checkout
      console.log("🚀 [DEBUG] Redirigiendo a Stripe Checkout...");
      navigate(
        `/stripe-checkout?client_secret=${stripeResponse.client_secret}&id_venta=${stripeResponse.id_venta}`
      );

    } catch (err: any) {
      console.error("🔴 [ERROR] Ocurrió un error en handlePagar.");
      console.error("🔴 [ERROR] Objeto de error completo:", err);
      
      // Verificar si hay respuesta del servidor
      if (err.response) {
        console.error("🔴 [ERROR] err.response:", err.response);
        console.error("🔴 [ERROR] err.response.data:", err.response.data);
        console.error("🔴 [ERROR] err.response.status:", err.response.status);
        console.error("🔴 [ERROR] err.response.headers:", err.response.headers);
      } else if (err.request) {
        console.error("🔴 [ERROR] La petición fue hecha pero no hubo respuesta");
        console.error("🔴 [ERROR] err.request:", err.request);
      } else {
        console.error("🔴 [ERROR] Error al configurar la petición:", err.message);
      }
      
      // Extraer el mensaje de error
      let errorMessage = "Ocurrió un error al procesar el pago. Por favor, intenta de nuevo.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error("🔴 [ERROR] Mensaje final mostrado al usuario:", errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Proceso de Pago</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de dirección */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold mb-4">1. Selecciona tu Dirección de Envío</h2>
              <div className="max-h-[450px] overflow-y-auto p-2">
                <DireccionSelector onDireccionSeleccionada={handleDireccionSeleccionada} />
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4">2. Resumen del Pedido</h2>
              
              {/* Lista de productos */}
              <div className="mb-4 max-h-[200px] overflow-y-auto">
                {productos.map((producto) => (
                  <div key={producto.id} className="flex justify-between items-center mb-2 text-sm">
                    <div className="flex-1">
                      <p className="font-medium truncate">{producto.nombre}</p>
                      <p className="text-gray-500">Cantidad: {producto.cantidad}</p>
                    </div>
                    <p className="font-semibold ml-2">Bs {(producto.precio * producto.cantidad).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>Bs {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>Bs {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePagar}
                disabled={!direccionSeleccionada || loading || productos.length === 0}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Procesando..." : "Confirmar y Pagar"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {direccionSeleccionada && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Dirección seleccionada:</p>
                  <p className="text-blue-700">{direccionSeleccionada.direccion}</p>
                  <p className="text-blue-600">{direccionSeleccionada.ciudad}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProcesoPago;