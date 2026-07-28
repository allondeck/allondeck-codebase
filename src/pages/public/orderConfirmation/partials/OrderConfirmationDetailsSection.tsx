import { Link } from 'react-router-dom';
import { formatPrice } from '../../../../lib/utils';

interface OrderConfirmationDetailsSectionProps {
  order: { total: number | string; status: string } | null;
}

export function OrderConfirmationDetailsSection({ order }: OrderConfirmationDetailsSectionProps) {
  const isPaid = order?.status === 'paid';
  const isPending = order?.status === 'pending';

  return (
    <div className="mx-auto max-w-md rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Order confirmed</h1>
      <p className="mt-2 text-brand-cream">
        Thank you for your order. {order && `Total: ${formatPrice(order.total)}`}
      </p>
      {isPaid && (
        <p className="mt-2 text-sm font-medium text-emerald-400">Payment received.</p>
      )}
      {isPending && (
        <p className="mt-2 text-sm text-brand-light">
          Payment is processing. This page will update when payment is confirmed.
        </p>
      )}
      <Link
        to="/products"
        className="mt-6 inline-block rounded-lg bg-brand-orange px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Continue shopping
      </Link>
      <Link
        to="/account"
        className="mt-4 block text-sm text-brand-light hover:text-white"
      >
        View order history
      </Link>
    </div>
  );
}
