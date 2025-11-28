// src/clientes/pages/productos/StripeCheckout.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Header from "../../components/common/Header";
import Footer from "../../../components/common/Footer";

// ⚠️ REEMPLAZA CON TU CLAVE PÚBLICA DE STRIPE
const STRIPE_PUBLISHABLE_KEY = "pk_test_51SPwcxFtZ96cb3oeme0YcABM1NotroPSleC1BHFkedwQw94AyFwvsgQ2HZ2MHXuCdAiczbqab2jvIrzyODWihhBr00u4gXLBgC"; // ← REEMPLAZA AQUÍ
// O usa variables de entorno:
// const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  idVenta: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ idVenta }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Verificar el estado del pago si regresamos de una redirección
    const clientSecretFromUrl = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (clientSecretFromUrl) {
      stripe.retrievePaymentIntent(clientSecretFromUrl).then(({ paymentIntent }) => {
        if (!paymentIntent) return;

        switch (paymentIntent.status) {
          case "succeeded":
            navigate(`/pago-exitoso?id_venta=${idVenta}`);
            break;
          case "processing":
            setMessage("Tu pago se está procesando.");
            break;
          case "requires_payment_method":
            setMessage("Tu pago no fue exitoso, por favor intenta de nuevo.");
            break;
          default:
            setMessage("Algo salió mal.");
            break;
        }
      });
    }
  }, [stripe, idVenta, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("🔴 [ERROR] Stripe o Elements no están listos");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    console.log("🔵 [DEBUG] Confirmando pago con Stripe...");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso?id_venta=${idVenta}`,
      },
    });

    // Este código solo se ejecuta si hay un error inmediato
    if (error) {
      console.error("🔴 [ERROR] Error al confirmar pago:", error);
      
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Ocurrió un error con tu tarjeta.");
      } else {
        setMessage("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Completa tu Pago</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Pedido #{idVenta}</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Ingresa los datos de tu tarjeta de forma segura
          </p>
        </div>

        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
        
        <button
          disabled={isLoading || !stripe || !elements}
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            "Pagar Ahora"
          )}
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {message}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Pago seguro procesado por Stripe
        </p>
      </form>
    </div>
  );
};

const StripeCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [idVenta, setIdVenta] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const secret = params.get("client_secret");
    const venta = params.get("id_venta");

    console.log("🔵 [DEBUG] Parámetros recibidos:", { secret, venta });

    if (!secret || !venta) {
      console.error("🔴 [ERROR] Faltan parámetros requeridos");
      navigate("/catalogo-cliente");
      return;
    }

    setClientSecret(secret);
    setIdVenta(Number(venta));
  }, [location, navigate]);

  if (!clientSecret || !idVenta) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Cargando checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout Seguro</h1>
            <p className="text-gray-600">Completa tu compra de forma segura</p>
          </div>

          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm idVenta={idVenta} />
          </Elements>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/catalogo-cliente")}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ← Volver al catálogo
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StripeCheckout;