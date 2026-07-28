import { Button } from "../../../../components/ui/Button";
import { formatPrice } from "../../../../lib/utils";
import { getSupabaseImageTransformUrl } from "../../../../lib/imageUtils";
import type { ProductRow } from "../../../../types/database";

type VariantType = {
  id: string;
  name: string;
  price: number | string | null;
  compare_at_price: number | string | null;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
};

interface ProductMainSectionProps {
  product: ProductRow;
  activeVariants: VariantType[];
  selectedVariantId: string | null;
  setSelectedVariantId: (id: string) => void;
  selectedVariant: VariantType | null;
  productPrice: number;
  hasComparePrice: boolean;
  compareAtPrice: number;
  inStock: boolean;
  currentStock: number;
  estimatedDelivery: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart: () => void;
  added: boolean;
}

export function ProductMainSection({
  product,
  activeVariants,
  selectedVariantId,
  setSelectedVariantId,
  selectedVariant,
  productPrice,
  hasComparePrice,
  compareAtPrice,
  inStock,
  currentStock,
  estimatedDelivery,
  quantity,
  setQuantity,
  onAddToCart,
  added,
}: ProductMainSectionProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="aspect-square w-full max-w-lg shrink-0 overflow-hidden rounded-lg bg-brand-dark-alt">
        {selectedVariant?.image_url || product.image_url ? (
          <img
            src={getSupabaseImageTransformUrl(
              selectedVariant?.image_url || product.image_url,
              {
                width: 600,
                height: 600,
                bucket: "products",
              },
            )}
            alt={product.name}
            width={600}
            height={600}
            loading="eager"
            decoding="async"
            // @ts-expect-error fetchpriority is valid HTML; camelCase fetchPriority triggers React DOM warning
            fetchpriority="high"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-light">
            <svg
              className="h-32 w-32"
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

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-2xl font-semibold text-brand-cream">
            {formatPrice(productPrice)}
          </span>
          {hasComparePrice && (
            <span className="text-lg text-brand-light line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
        {product.description && (
          <p className="mt-4 text-brand-cream">{product.description}</p>
        )}
        {!inStock && <p className="mt-2 text-red-400">Out of stock</p>}
        {inStock && (
          <p className="mt-2 text-sm text-brand-light">
            {currentStock} in stock
            {estimatedDelivery && (
              <span className="block mt-1">Ships in {estimatedDelivery}</span>
            )}
          </p>
        )}
        {!inStock && estimatedDelivery && (
          <p className="mt-2 text-sm text-brand-light">
            Ships in {estimatedDelivery}
          </p>
        )}

        {activeVariants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-white mb-3">
              Select Option
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeVariants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const isVariantOutOfStock = variant.stock_quantity <= 0;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={isVariantOutOfStock}
                    className={`
                      px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                      ${
                        isSelected
                          ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                          : "border-brand-medium/40 bg-brand-dark-alt text-white hover:border-brand-light/50"
                      }
                      ${isVariantOutOfStock ? "opacity-50 cursor-not-allowed line-through" : ""}
                    `}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {inStock && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border border-brand-medium/50 bg-brand-dark-alt">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-brand-cream hover:bg-brand-medium/30 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-medium text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(currentStock, q + 1))
                }
                className="px-4 py-2 text-brand-cream hover:bg-brand-medium/30 transition-colors"
              >
                +
              </button>
            </div>
            <Button
              type="button"
              onClick={onAddToCart}
              className={`px-6 py-3 ${
                added ? "!bg-green-600 hover:!bg-green-700" : ""
              }`}
            >
              {added ? "Added to cart" : "Add to cart"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
