import { ProductCard } from "../../../../components/features/ProductCard";
import type { ProductRow } from "../../../../types/database";

interface ProductSuggestedSectionProps {
  suggested: ProductRow[];
  suggestedLoading: boolean;
}

export function ProductSuggestedSection({
  suggested,
  suggestedLoading,
}: ProductSuggestedSectionProps) {
  if (!suggestedLoading && suggested.length === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-medium/35 pt-12">
      <h2 className="mb-6 text-xl font-semibold text-white">
        You might also like
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
          {suggested.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
