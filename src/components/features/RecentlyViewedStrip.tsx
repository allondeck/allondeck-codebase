import { ProductCard } from "./ProductCard";
import type { ProductRow } from "../../types/database";

type RecentlyViewedStripProps = {
  products: ProductRow[];
  loading: boolean;
  title?: string;
  id?: string;
};

export function RecentlyViewedStrip({
  products,
  loading,
  title = "Recently viewed",
  id,
}: RecentlyViewedStripProps) {
  if (loading && products.length === 0) return null;
  if (!loading && products.length === 0) return null;

  return (
    <section id={id} className="min-w-0 border-t border-gray-200 pt-8">
      <h2 className="mb-4 break-words text-xl font-semibold text-gray-900">
        {title}
      </h2>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-56 w-40 shrink-0 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="w-40 min-w-[140px] shrink-0 sm:min-w-[160px]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
