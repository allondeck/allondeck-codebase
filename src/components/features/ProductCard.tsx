import { Link } from "react-router-dom";
import { formatPrice, parsePrice } from "../../lib/utils";
import { getSupabaseImageTransformUrl } from "../../lib/imageUtils";
import { useWishlist } from "../../hooks/useWishlist";
import type { ProductRow } from "../../types/database";

/** Default intrinsic size for product card images (1:1). Reserves space to avoid CLS. */
const PRODUCT_IMAGE_SIZE = 400;

type ProductCardProps = {
  product: ProductRow;
  /** Set for first few cards on the page to improve LCP (e.g. fetchpriority="high"). */
  priority?: boolean;
};

export function ProductCard({ product, priority }: ProductCardProps) {
  const price = parsePrice(product.price);
  const compareAtPrice = parsePrice(product.compare_at_price);
  const hasComparePrice = compareAtPrice > 0 && compareAtPrice > price;
  const inStock = product.stock_quantity > 0;
  const { isInWishlist, toggle } = useWishlist();
  const saved = isInWishlist(product.id);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-brand-medium/30 bg-brand-dark-alt shadow-md transition hover:shadow-lg hover:border-brand-orange/40"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-dark">
        {product.image_url ? (
          <img
            src={getSupabaseImageTransformUrl(product.image_url, {
              width: PRODUCT_IMAGE_SIZE,
              height: PRODUCT_IMAGE_SIZE,
              bucket: "products",
            })}
            alt={product.name}
            width={PRODUCT_IMAGE_SIZE}
            height={PRODUCT_IMAGE_SIZE}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-light/50">
            <svg
              className="h-24 w-24"
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
        {product.is_featured && (
          <span className="absolute left-2 top-2 rounded bg-brand-orange px-2 py-0.5 text-xs font-semibold text-white">
            Featured
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute right-2 top-2 rounded-full bg-brand-dark-alt/95 p-1.5 shadow-sm transition hover:bg-brand-medium"
          aria-label={saved ? "Remove from wishlist" : "Save for later"}
        >
          {saved ? (
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-brand-light hover:text-brand-orange"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="min-w-0 p-4 font-sans bg-brand-dark-alt">
        <h3 className="line-clamp-2 font-bold text-brand-cream break-words group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-white">
            {formatPrice(price)}
          </span>
          {hasComparePrice && (
            <span className="text-sm text-brand-light line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
        {!inStock && <p className="mt-1 text-sm text-red-400 font-bold">Out of stock</p>}
      </div>
    </Link>
  );
}
