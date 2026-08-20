import { Select } from "../../../../components/ui/Select";
import { formatPrice } from "../../../../lib/utils";
import type { ProductSortBy } from "../../../../hooks/useProducts";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "stock_asc", label: "Stock: low to high" },
  { value: "stock_desc", label: "Stock: high to low" },
];

interface ProductsHeaderControlsProps {
  search: string;
  setSearch: (s: string) => void;
  sortParam: ProductSortBy;
  onSortChange: (v: ProductSortBy) => void;
  activeFilterCount: number;
  showPriceFilter: boolean;
  priceMin: number;
  priceFloor: number;
  priceMax: number;
  priceCeil: number;
  showInStockFilter: boolean;
  inStockOnly: boolean;
  showSaleFilter: boolean;
  onSaleOnly: boolean;
  showFeaturedFilter: boolean;
  featuredOnly: boolean;
  showNewArrivalsFilter: boolean;
  newArrivalsOnly: boolean;
  showLowStockFilter: boolean;
  lowStockOnly: boolean;
  showDealsFilter: boolean;
  dealsOnly: boolean;
  setFilterParams: (updates: any) => void;
  clearAllFilters: () => void;
}

export function ProductsHeaderControls({
  search,
  setSearch,
  sortParam,
  onSortChange,
  activeFilterCount,
  showPriceFilter,
  priceMin,
  priceFloor,
  priceMax,
  priceCeil,
  showInStockFilter,
  inStockOnly,
  showSaleFilter,
  onSaleOnly,
  showFeaturedFilter,
  featuredOnly,
  showNewArrivalsFilter,
  newArrivalsOnly,
  showLowStockFilter,
  lowStockOnly,
  showDealsFilter,
  dealsOnly,
  setFilterParams,
  clearAllFilters,
}: ProductsHeaderControlsProps) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-4 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <Select
          value={sortParam}
          onChange={(e) => onSortChange(e.target.value as ProductSortBy)}
          className="w-full shrink-0 sm:w-auto sm:min-w-[160px]"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {showPriceFilter &&
            (priceMin !== priceFloor || priceMax !== priceCeil) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
                {formatPrice(priceMin)} – {formatPrice(priceMax)}
                <button
                  type="button"
                  onClick={() =>
                    setFilterParams({ minPrice: null, maxPrice: null })
                  }
                  className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                  aria-label="Remove price filter"
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden>×</span>
                </button>
              </span>
            )}
          {showInStockFilter && inStockOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              In stock
              <button
                type="button"
                onClick={() => setFilterParams({ inStock: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove in stock filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {showSaleFilter && onSaleOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              On sale
              <button
                type="button"
                onClick={() => setFilterParams({ sale: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove on sale filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {showFeaturedFilter && featuredOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              Featured
              <button
                type="button"
                onClick={() => setFilterParams({ featured: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove featured filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {showNewArrivalsFilter && newArrivalsOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              New arrivals
              <button
                type="button"
                onClick={() => setFilterParams({ new: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove new arrivals filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {showLowStockFilter && lowStockOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              Low stock
              <button
                type="button"
                onClick={() => setFilterParams({ lowStock: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove low stock filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {showDealsFilter && dealsOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-medium/30 px-3 py-1 text-sm text-brand-cream">
              Deals
              <button
                type="button"
                onClick={() => setFilterParams({ deals: false })}
                className="ml-1 rounded-full p-0.5 hover:bg-brand-medium/50"
                aria-label="Remove deals filter"
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-brand-light underline hover:text-white"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
}
