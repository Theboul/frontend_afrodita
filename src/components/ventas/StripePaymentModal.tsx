import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

type Props = {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
  onSucceeded?: () => void;
};

// Notar: creamos la promesa dentro del componente para poder validar la PK

function CheckoutInner({ onClose, onSucceeded }: { onClose: () => void; onSucceeded?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: err } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (err) throw new Error(err.message || 'No se pudo confirmar el pago');
      onSucceeded?.();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'Error al procesar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Pagar con tarjeta</h3>
        <div className="mb-3">
          <PaymentElement />
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1 border rounded" disabled={submitting}>Cancelar</button>
          <button onClick={handlePay} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!stripe || !elements || submitting}>
            {submitting ? 'Procesando...' : 'Pagar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StripePaymentModal({ open, clientSecret, onClose, onSucceeded }: Props) {
  const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
  const stripePromise = useMemo(() => (pk ? loadStripe(pk) : null), [pk]);
  const options = useMemo(() => ({ clientSecret, appearance: { theme: 'stripe' as const } }), [clientSecret]);
  if (!open) return null;
  if (!pk) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow max-w-md w-full text-sm">
          Falta configurar VITE_STRIPE_PUBLIC_KEY en el frontend.
          <div className="text-right mt-3">
            <button className="px-3 py-1 border rounded" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }
  if (!clientSecret) {
    return null;
  }
  return (
    <Elements stripe={stripePromise!} options={options}>
      <CheckoutInner onClose={onClose} onSucceeded={onSucceeded} />
    </Elements>
  );
}
