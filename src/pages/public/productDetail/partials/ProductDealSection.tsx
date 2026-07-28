import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { formatPrice } from "../../../../lib/utils";
import { getSupabaseImageTransformUrl } from "../../../../lib/imageUtils";
import type { ProductRow } from "../../../../types/database";
import type { DealWithItems } from "../../../../hooks/useDeals";

interface ProductDealSectionProps {
  dealContainingProduct: DealWithItems | null;
  dealProductMap: Map<string, ProductRow>;
  dealProductsLoading: boolean;
  onAddComboToCart: () => void;
  comboAdded: boolean;
}

export function ProductDealSection({
  dealContainingProduct,
  dealProductMap,
  dealProductsLoading,
  onAddComboToCart,
  comboAdded,
}: ProductDealSectionProps) {
  if (!dealContainingProduct) return null;

  return (
    <section className="mt-12 border-t border-brand-medium/35 pt-10">
      <h2 className="mb-3 text-xl font-semibold text-white">Deal</h2>
      <p className="mb-4 text-sm text-brand-cream">
        This product is part of{" "}
        <strong>{dealContainingProduct.name}</strong> — all items together
        for {formatPrice(dealContainingProduct.total_price)}.
      </p>
      {dealProductsLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 w-28 shrink-0 animate-pulse rounded-lg bg-brand-dark-alt"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {dealContainingProduct.deal_items.map((item) => {
              const p = dealProductMap.get(item.product_id);
              if (!p) return null;
              return (
                <Link
                  key={item.id}
                  to={`/products/${p.slug}`}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-3 transition hover:border-brand-medium/60 hover:bg-brand-medium/30"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-md bg-brand-dark">
                    {p.image_url ? (
                      <img
                        src={getSupabaseImageTransformUrl(p.image_url, {
                          width: 80,
                          height: 80,
                          bucket: "products",
                        })}
                        alt={p.name}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
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
                  <span className="max-w-[100px] truncate text-center text-sm font-medium text-white">
                    {p.name}
                  </span>
                  <span className="text-xs text-brand-light">
                    ×{item.quantity}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={onAddComboToCart}
              className={
                comboAdded ? "!bg-green-600 hover:!bg-green-700" : ""
              }
            >
              {comboAdded ? "Added to cart" : "Add combo to cart"}
            </Button>
            <span className="text-lg font-semibold text-brand-cream">
              {formatPrice(dealContainingProduct.total_price)}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
