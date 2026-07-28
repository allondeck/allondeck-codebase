import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { formatPrice, parsePrice } from "../../../../lib/utils";
import type { CartItem } from "../../../../types/cart";
import { isProductCartItem } from "../../../../types/cart";

interface CheckoutSummarySectionProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  estimatedDelivery: string;
  loading: boolean;
}

export function CheckoutSummarySection({
  items,
  subtotal,
  discountAmount,
  total,
  estimatedDelivery,
  loading,
}: CheckoutSummarySectionProps) {
  return (
    <>
      <div className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
        <h2 className="font-semibold text-white">Order Summary</h2>
        <ul className="mt-4 space-y-2">
          {items.map((item, idx) =>
            isProductCartItem(item) ? (
              <li
                key={item.product.id}
                className="flex justify-between text-brand-cream"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(
                    parsePrice(item.product.price) * item.quantity,
                  )}
                </span>
              </li>
            ) : (
              <li
                key={`combo-${item.dealId}-${idx}`}
                className="flex justify-between text-brand-cream"
              >
                <span>
                  Combo: {item.dealName} × {item.quantity}
                </span>
                <span>{formatPrice(item.totalPrice * item.quantity)}</span>
              </li>
            ),
          )}
        </ul>
        <div className="mt-4 space-y-1 border-t border-brand-medium/35 pt-4">
          <div className="flex justify-between text-brand-cream">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount</span>
              <span>−{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        {estimatedDelivery && (
          <p className="mt-3 text-sm text-brand-light">
            Ships in {estimatedDelivery}
          </p>
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <Link
          to="/cart"
          className="inline-flex items-center rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-6 py-3 font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Back to Cart
        </Link>
        <Button type="submit" disabled={loading} className="px-6 py-3">
          {loading ? "Proceeding to payment..." : "Proceed to payment"}
        </Button>
      </div>
    </>
  );
}
