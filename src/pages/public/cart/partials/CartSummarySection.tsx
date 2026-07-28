import { Link } from "react-router-dom";
import { formatPrice } from "../../../../lib/utils";

interface CartSummarySectionProps {
  itemCount: number;
  subtotal: number;
}

export function CartSummarySection({ itemCount, subtotal }: CartSummarySectionProps) {
  return (
    <div className="w-full lg:w-80">
      <div className="sticky top-8 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
        <h2 className="font-semibold text-white">Order Summary</h2>
        <div className="mt-4 flex justify-between text-brand-cream">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-4 border-t border-brand-medium/35 pt-4">
          <div className="flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-lg bg-brand-orange py-3 text-center font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Proceed to Checkout
        </Link>
        <Link
          to="/wishlist"
          className="mt-3 block w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt py-3 text-center font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          View Wishlist
        </Link>
      </div>
    </div>
  );
}
