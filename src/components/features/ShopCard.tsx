import { Link } from "react-router-dom";
import type { ProductRow } from "../../types/database";

interface ShopCardProps {
  product: ProductRow;
  className?: string;
}

/**
 * ShopCard.tsx
 *
 * Card component for displaying product previews in the home shop section carousel.
 */
export function ShopCard({ product, className = "" }: ShopCardProps) {
  return (
    <Link
      to={`/products/${product.slug}`}
      aria-label={`View ${product.name}, $${Number(product.price).toFixed(2)}`}
      className={`snap-start shrink-0 w-[280px] md:w-[320px] xl:w-[340px] flex flex-col bg-brand-medium rounded-[2rem] p-4 border border-transparent hover:border-brand-orange/50 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${className}`.trim()}
    >
      <div className="relative bg-white aspect-[4/5] rounded-3xl overflow-hidden shadow-inner">
        {product.image_url ? (
          <img
            src={`https://rckxskncdxobolhctnfw.supabase.co/storage/v1/object/public/products/${product.image_url}`}
            alt={product.name}
            width={320}
            height={400}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-8 hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute bottom-2 right-2 bg-brand-orange rounded-full w-9 h-9 flex items-center justify-center text-white text-xl font-black shadow-md transition-colors hover:bg-orange-600"
        >
          +
        </div>
      </div>
      <div className="mt-5 px-2 pb-1">
        <h3 className="font-heading font-medium text-white tracking-widest text-lg uppercase truncate">
          {product.name}
        </h3>
        <p className="text-white text-sm mt-1 font-bold tracking-wider">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
