import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { isProductCartItem } from "../../types/cart";
import { useAuth } from "../../context/AuthContext";
import { formatPrice, parsePrice } from "../../lib/utils";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { createOrder, type ShippingAddressInput } from "../../lib/orders";
import { applyCoupon, type ApplyCouponResult } from "../../lib/coupons";
import { supabase } from "../../lib/supabase";
import {
  DEFAULT_SHIPPING_COUNTRIES,
  parseShippingCountries,
} from "../../lib/shippingCountries";

const CHECKOUT_SAVED_KEY_PREFIX = "checkout_saved_";

type SavedCheckoutInfo = {
  address: ShippingAddressInput;
  guestEmail?: string;
};

function getCheckoutStorageKey(userId: string | undefined): string {
  return userId
    ? `${CHECKOUT_SAVED_KEY_PREFIX}${userId}`
    : `${CHECKOUT_SAVED_KEY_PREFIX}guest`;
}

function getSavedCheckoutInfo(
  userId: string | undefined,
): SavedCheckoutInfo | null {
  try {
    const raw = localStorage.getItem(getCheckoutStorageKey(userId));
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedCheckoutInfo;
    if (!data || !data.address || typeof data.address !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

function setSavedCheckoutInfo(
  userId: string | undefined,
  info: SavedCheckoutInfo,
): void {
  localStorage.setItem(getCheckoutStorageKey(userId), JSON.stringify(info));
}

const initialAddress: ShippingAddressInput = {
  full_name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};

/** Title-case: first letter and every letter after a space uppercase. */
function capitalizeWords(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

export default function Checkout() {
  const { items, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const countryOptions = (
    parseShippingCountries(settings.shipping_countries).length > 0
      ? parseShippingCountries(settings.shipping_countries)
      : DEFAULT_SHIPPING_COUNTRIES
  ) as string[];
  const navigate = useNavigate();
  const estimatedDelivery = (() => {
    const v = settings.estimated_delivery;
    if (v == null) return "";
    if (typeof v === "string") return v.replace(/^"|"$/g, "").trim();
    return "";
  })();
  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState<ShippingAddressInput>(initialAddress);
  const lastPreFilledKeyRef = useRef<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ApplyCouponResult | null>(
    null,
  );
  const [couponApplying, setCouponApplying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => {
    if (isProductCartItem(i))
      return sum + parsePrice(i.product.price) * i.quantity;
    return sum + i.totalPrice * i.quantity;
  }, 0);
  const discountAmount = couponResult?.ok ? couponResult.discountAmount : 0;
  const total = Math.max(0, subtotal - discountAmount);

  async function handleApplyCoupon() {
    setCouponApplying(true);
    setCouponResult(null);
    const result = await applyCoupon(couponCode, items);
    setCouponResult(result);
    setCouponApplying(false);
  }

  function handleRemoveCoupon() {
    setCouponCode("");
    setCouponResult(null);
  }

  useEffect(() => {
    const key = getCheckoutStorageKey(user?.id);
    if (lastPreFilledKeyRef.current === key) return;
    lastPreFilledKeyRef.current = key;
    const saved = getSavedCheckoutInfo(user?.id);
    if (saved) {
      setAddress({ ...initialAddress, ...saved.address });
      if (!user && saved.guestEmail) setGuestEmail(saved.guestEmail);
    }
  }, [user]);

  if (itemCount === 0) {
    return (
      <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-12 text-center">
        <h2 className="text-xl font-semibold text-white">
          No items to checkout
        </h2>
        <p className="mt-2 text-brand-light">Add products to your cart first.</p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-lg bg-brand-orange px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!user && !guestEmail.trim()) {
      setError("Please enter your email for guest checkout.");
      return;
    }
    const { full_name, line1, city, state, postal_code, country } = address;
    if (
      !(full_name || "").trim() ||
      !(line1 || "").trim() ||
      !(city || "").trim() ||
      !(state || "").trim() ||
      !(postal_code || "").trim() ||
      !(country || "").trim()
    ) {
      setError("Please fill in all required shipping address fields.");
      return;
    }
    setError(null);

    const storageKey = getCheckoutStorageKey(user?.id);
    const alreadySaved = localStorage.getItem(storageKey);
    if (!alreadySaved) {
      const message = user
        ? "Save your shipping address for next time?"
        : "Save your shipping address and email for next time?";
      if (window.confirm(message)) {
        setSavedCheckoutInfo(user?.id, {
          address: {
            full_name: (full_name || "").trim(),
            line1: (line1 || "").trim(),
            line2: address.line2?.trim() || "",
            city: city.trim(),
            state: state.trim(),
            postal_code: (postal_code || "").trim(),
            country: country.trim(),
            phone: address.phone?.trim() || "",
          },
          ...(!user && { guestEmail: guestEmail.trim() }),
        });
      }
    }

    setLoading(true);
    try {
      const order = await createOrder({
        items,
        userId: user?.id ?? null,
        customerEmail: user?.email ?? guestEmail.trim(),
        couponId: couponResult?.ok ? couponResult.coupon.id : null,
        discountAmount: couponResult?.ok ? couponResult.discountAmount : 0,
        total,
        subtotal,
        shippingTotal: 0, // Placeholder
        taxTotal: 0, // Placeholder
        shippingAddress: {
          full_name: (full_name || "").trim(),
          line1: (line1 || "").trim(),
          line2: address.line2?.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postal_code: (postal_code || "").trim(),
          country: country.trim(),
          phone: address.phone?.trim() || undefined,
        },
        billingAddress: {
          full_name: (full_name || "").trim(),
          line1: (line1 || "").trim(),
          line2: address.line2?.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postal_code: (postal_code || "").trim(),
          country: country.trim(),
          phone: address.phone?.trim() || undefined,
        },
      });
      const orderId = order.id;
      clearCart();

      const { data: sessionData, error: sessionError } =
          await supabase.functions.invoke("create-checkout-session", {
            body: { orderId },
          });
      const checkoutUrl = sessionData?.url;
      if (checkoutUrl && typeof checkoutUrl === "string") {
        window.location.href = checkoutUrl;
        return;
      }
      if (sessionError) {
        console.warn("Stripe checkout not available:", sessionError.message);
      }
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 sm:px-6 lg:px-8 text-left">
      <h1 className="mb-8 text-2xl font-bold text-white">Checkout</h1>
      <form onSubmit={handlePlaceOrder}>
        {!user && (
          <div className="mb-6 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
            <label
              htmlFor="guestEmail"
              className="block text-sm font-medium text-brand-cream"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="guestEmail"
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              placeholder="you@example.com"
            />
          </div>
        )}
        <div className="mb-6 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
          <h2 className="mb-4 font-semibold text-white">Shipping address</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-brand-cream"
              >
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={address.full_name || ""}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, full_name: e.target.value }))
                }
                onBlur={(e) =>
                  setAddress((a) => ({
                    ...a,
                    full_name: capitalizeWords(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="line1"
                className="block text-sm font-medium text-brand-cream"
              >
                Address line 1 <span className="text-red-500">*</span>
              </label>
              <input
                id="line1"
                type="text"
                required
                value={address.line1 || ""}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, line1: e.target.value }))
                }
                onBlur={(e) =>
                  setAddress((a) => ({
                    ...a,
                    line1: capitalizeWords(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label
                htmlFor="line2"
                className="block text-sm font-medium text-brand-cream"
              >
                Address line 2 <span className="text-brand-light/60">(optional)</span>
              </label>
              <input
                id="line2"
                type="text"
                value={address.line2 || ""}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, line2: e.target.value }))
                }
                onBlur={(e) =>
                  setAddress((a) => ({
                    ...a,
                    line2: capitalizeWords(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                placeholder="Apt 4"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-brand-cream"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, city: e.target.value }))
                  }
                  onBlur={(e) =>
                    setAddress((a) => ({
                      ...a,
                      city: capitalizeWords(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  placeholder="New York"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-brand-cream"
                >
                  State / Province <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, state: e.target.value }))
                  }
                  onBlur={(e) =>
                    setAddress((a) => ({
                      ...a,
                      state: capitalizeWords(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-brand-cream"
                >
                  Postal code <span className="text-red-500">*</span>
                </label>
                <input
                  id="postal_code"
                  type="text"
                  required
                  value={address.postal_code || ""}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, postal_code: e.target.value }))
                  }
                  onBlur={(e) =>
                    setAddress((a) => ({
                      ...a,
                      postal_code: capitalizeWords(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  placeholder="10001"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-brand-cream"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  required
                  value={
                    countryOptions.includes(address.country)
                      ? address.country
                      : ""
                  }
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, country: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  <option value="">Select country</option>
                  {countryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-brand-cream"
              >
                Phone <span className="text-brand-light/60">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={address.phone || ""}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, phone: e.target.value }))
                }
                onBlur={(e) =>
                  setAddress((a) => ({
                    ...a,
                    phone: capitalizeWords(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6 rounded-lg bg-red-900/50 p-3 text-sm text-red-200 border border-red-500/30">
            {error}
          </div>
        )}

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
                onClick={handleRemoveCoupon}
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
                onClick={handleApplyCoupon}
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
      </form>
    </div>
  );
}
