import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  isProductCartItem,
  isComboCartItem,
  getCartLineKey,
} from "../../types/cart";
import { formatPrice, parsePrice } from "../../lib/utils";
import { getSupabaseImageTransformUrl } from "../../lib/imageUtils";
import { SEO } from "../../components/ui/SEO";

export default function Cart() {
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce((sum, i) => {
    if (isProductCartItem(i)) {
      const price = i.variant_price != null ? Number(i.variant_price) : parsePrice(i.product.price);
      return sum + price * i.quantity;
    }
    if (isComboCartItem(i)) return sum + i.totalPrice * i.quantity;
    return sum;
  }, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full">
      <SEO title="Shopping Cart | All On Deck" description="Review your selected marine deck items and proceed to checkout." />
      {itemCount === 0 ? (
        <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-12 text-center">
          <h2 className="text-xl font-semibold text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-brand-light">Add some products to get started.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Browse Products
            </Link>
            <Link
              to="/wishlist"
              className="inline-block rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-6 py-3 font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <h1 className="mb-6 text-2xl font-bold text-white">Shopping Cart</h1>
            <div className="space-y-4">
              {items.map((item) => {
                const lineKey = getCartLineKey(item);
                if (isProductCartItem(item)) {
                  const { product, quantity } = item;
                  return (
                    <div
                      key={lineKey}
                      className="flex gap-4 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-4"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-brand-dark">
                        {item.variant_image_url || product.image_url ? (
                          <img
                            src={getSupabaseImageTransformUrl((item.variant_image_url || product.image_url)!, {
                              width: 96,
                              height: 96,
                              bucket: "products",
                            })}
                            alt={product.name}
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-brand-light">
                            <svg
                              className="h-8 w-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-medium text-white hover:text-brand-light"
                        >
                          {product.name}
                        </Link>
                        {item.variant_name && (
                          <p className="mt-0.5 text-sm text-brand-light">
                            {item.variant_name}
                          </p>
                        )}
                        <p className="mt-1 text-brand-cream">
                          {formatPrice(item.variant_price != null ? item.variant_price : parsePrice(product.price))} × {quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-brand-medium/50 bg-brand-dark">
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineKey, quantity - 1)}
                            className="px-2 py-1 text-brand-cream hover:bg-brand-medium/30"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineKey, quantity + 1)}
                            className="px-2 py-1 text-brand-cream hover:bg-brand-medium/30"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(lineKey)}
                          className="text-red-400 hover:text-red-500"
                          aria-label="Remove"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="w-20 text-right font-medium text-brand-cream">
                        {formatPrice((item.variant_price != null ? item.variant_price : parsePrice(product.price)) * quantity)}
                      </div>
                    </div>
                  );
                }
                if (isComboCartItem(item)) {
                  const {
                    dealName,
                    totalPrice,
                    quantity,
                    items: comboItems,
                  } = item;
                  return (
                    <div
                      key={lineKey}
                      className="flex flex-col gap-3 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded bg-brand-medium/20 text-brand-light">
                          <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-white">
                            Combo: {dealName}
                          </span>
                          <p className="mt-1 text-sm text-brand-light">
                            {comboItems.length} item(s) · {formatPrice(totalPrice)}{" "}
                            each
                          </p>
                          <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-brand-cream">
                            {comboItems.map((entry, idx) => (
                              <li key={`${entry.product_id}-${idx}`}>
                                {entry.product_name} × {entry.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
                        <div className="flex items-center rounded border border-brand-medium/50 bg-brand-dark">
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineKey, quantity - 1)}
                            className="px-2 py-1 text-brand-cream hover:bg-brand-medium/30"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineKey, quantity + 1)}
                            className="px-2 py-1 text-brand-cream hover:bg-brand-medium/30"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(lineKey)}
                          className="text-red-400 hover:text-red-500"
                          aria-label="Remove"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <div className="w-20 text-right font-medium text-brand-cream">
                          {formatPrice(totalPrice * quantity)}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

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
        </div>
      )}
    </div>
  );
}
