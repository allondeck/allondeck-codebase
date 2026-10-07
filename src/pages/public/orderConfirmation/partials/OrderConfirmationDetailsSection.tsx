import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../../../lib/utils';

interface OrderConfirmationDetailsSectionProps {
  order: { total: number | string; status: string } | null;
}

export function OrderConfirmationDetailsSection({ order }: OrderConfirmationDetailsSectionProps) {
  const isPaid = order?.status === 'paid';
  const isPending = order?.status === 'pending';

  return (
    <div className="w-full max-w-lg rounded-2xl border border-brand-medium/35 bg-brand-dark-alt p-8 sm:p-10 lg:p-12 text-center shadow-2xl">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
        <CheckCircle2 className="h-9 w-9 stroke-[2.2]" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-widest text-brand-cream uppercase drop-shadow-md">
        Order confirmed
      </h1>
      <p className="mt-3 text-base sm:text-lg text-brand-cream/90 leading-relaxed">
        Thank you for your order. {order && `Total: ${formatPrice(order.total)}`}
      </p>
      {isPaid && (
        <p className="mt-3 text-sm font-semibold text-emerald-400">Payment received.</p>
      )}
      {isPending && (
        <p className="mt-3 text-sm text-brand-light">
          Payment is processing. This page will update when payment is confirmed.
        </p>
      )}
      <div className="mt-8 pt-2 flex flex-col items-center gap-3.5">
        <Link
          to="/products"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-brand-orange px-8 py-3.5 font-bold uppercase tracking-wider text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
        >
          Continue shopping
        </Link>
        <Link
          to="/account"
          className="block text-sm font-medium text-brand-light hover:text-white transition-colors"
        >
          View order history
        </Link>
      </div>
    </div>
  );
}
