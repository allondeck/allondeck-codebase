import { ProductCard } from "../../../../components/features/ProductCard";
import type { ProductRow } from "../../../../types/database";

interface ProductsGridSectionProps {
  loading: boolean;
  error: any;
  products: ProductRow[];
  showSuggested: boolean;
  suggestedLoading: boolean;
  suggested: ProductRow[];
}

export function ProductsGridSection({
  loading,
  error,
  products,
  showSuggested,
  suggestedLoading,
  suggested,
}: ProductsGridSectionProps) {
  return (
    <>
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-brand-dark-alt"
            />
          ))}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-900/50 p-4 text-red-200 border border-red-500/30">
          Failed to load products. Check your Supabase setup.
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-brand-light">No products found.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>
      )}

      {showSuggested && (
        <section className="mt-12 border-t border-brand-medium/35 pt-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Suggested items
          </h2>
          {suggestedLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-lg bg-brand-dark-alt"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
