import { Button } from "../../../../components/ui/Button";
import { formatPrice } from "../../../../lib/utils";
import type { ApplyCouponResult } from "../../../../lib/coupons";

interface CouponSectionProps {
  couponCode: string;
  couponResult: ApplyCouponResult | null;
  couponApplying: boolean;
  setCouponCode: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

export function CouponSection({
  couponCode,
  couponResult,
  couponApplying,
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponSectionProps) {
  return (
    <div className="mb-6 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
      <h2 className="mb-3 font-semibold text-white">Coupon</h2>
      {couponResult?.ok ? (
        <div className="flex items-center justify-between rounded-lg bg-emerald-900/40 border border-emerald-500/30 px-3 py-2 text-sm text-emerald-200">
          <span className="font-medium">
            {couponResult.coupon.code} applied (−
            {formatPrice(couponResult.discountAmount)})
          </span>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="font-medium underline hover:no-underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 font-mono uppercase text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={onApplyCoupon}
            disabled={couponApplying || !couponCode.trim()}
          >
            {couponApplying ? "Checking..." : "Apply"}
          </Button>
        </div>
      )}
      {couponResult && !couponResult.ok && (
        <p className="mt-2 text-sm text-red-400">{couponResult.error}</p>
      )}
    </div>
  );
}
