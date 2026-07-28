import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PriceRangeSlider } from "../../../components/ui/PriceRangeSlider";
import { useProducts, type ProductSortBy } from "../../../hooks/useProducts";
import { useSuggestedProductsForListing } from "../../../hooks/useSuggestedProductsForListing";
import { useCategories } from "../../../hooks/useCategories";
import { useStoreSettings } from "../../../hooks/useStoreSettings";
import { parsePrice } from "../../../lib/utils";
import {
  parseProductFilters,
  parseShowOutOfStock,
  parseNewArrivalsDays,
} from "../../../lib/productFilters";
import { useDeals } from "../../../hooks/useDeals";
import type { ProductRow } from "../../../types/database";
import { SEO } from "../../../components/ui/SEO";
import { ProductsSidebarSection } from "./partials/ProductsSidebarSection";
import { ProductsMobileFiltersSection } from "./partials/ProductsMobileFiltersSection";
import { ProductsHeaderControls } from "./partials/ProductsHeaderControls";
import { ProductsGridSection } from "./partials/ProductsGridSection";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "stock_asc", label: "Stock: low to high" },
  { value: "stock_desc", label: "Stock: high to low" },
];

const SEARCH_DEBOUNCE_MS = 400;
const DEFAULT_LOW_STOCK_CEILING = 5;

type ProductForFilter = ProductRow;

export type ProductFilters = {
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  featuredOnly?: boolean;
  newArrivalsOnly?: boolean;
  lowStockOnly?: boolean;
  dealsOnly?: boolean;
};

function filterAndSortProducts(
  products: ProductForFilter[],
  search: string,
  sortBy: ProductSortBy,
  filters: ProductFilters,
  options: { newArrivalsDays: number; dealProductIdSet: Set<string> },
): ProductRow[] {
  const trimmed = search.trim().toLowerCase();
  let list = trimmed
    ? products.filter((p) => p.name.toLowerCase().includes(trimmed))
    : products;

  const {
    priceMin,
    priceMax,
    inStockOnly,
    onSaleOnly,
    featuredOnly,
    newArrivalsOnly,
    lowStockOnly,
    dealsOnly,
  } = filters;
  if (priceMin != null && priceMin > 0) {
    list = list.filter((p) => parsePrice(p.price) >= priceMin);
  }
  if (priceMax != null && priceMax > 0) {
    list = list.filter((p) => parsePrice(p.price) <= priceMax);
  }
  if (inStockOnly) {
    list = list.filter((p) => (p.stock_quantity ?? 0) > 0);
  }
  if (onSaleOnly) {
    list = list.filter(
      (p) =>
        p.compare_at_price != null &&
        parsePrice(p.compare_at_price) > parsePrice(p.price),
    );
  }
  if (featuredOnly) {
    list = list.filter((p) => p.is_featured === true);
  }
  if (newArrivalsOnly) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.newArrivalsDays);
    const cutoffTime = cutoff.getTime();
    list = list.filter((p) => new Date(p.created_at).getTime() >= cutoffTime);
  }
  if (lowStockOnly) {
    list = list.filter((p) => {
      const stock = p.stock_quantity ?? 0;
      if (stock <= 0) return false;
      const ceiling = p.low_stock_threshold ?? DEFAULT_LOW_STOCK_CEILING;
      return stock <= ceiling;
    });
  }
  if (dealsOnly && options.dealProductIdSet.size > 0) {
    list = list.filter((p) => options.dealProductIdSet.has(p.id));
  }

  const sorted = [...list].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return parsePrice(a.price) - parsePrice(b.price);
      case "price_desc":
        return parsePrice(b.price) - parsePrice(a.price);
      case "stock_asc":
        return (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0);
      case "stock_desc":
        return (b.stock_quantity ?? 0) - (a.stock_quantity ?? 0);
      case "newest":
      default: {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        return bDate - aDate;
      }
    }
  });
  return sorted;
}

function getPriceBounds(products: ProductRow[]): {
  min: number;
  max: number;
  step: number;
} {
  if (products.length === 0) return { min: 0, max: 100, step: 1 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    const price = parsePrice(p.price);
    if (price < min) min = price;
    if (price > max) max = price;
  }
  if (min === Infinity) min = 0;
  if (max === -Infinity || max < min) max = Math.max(min, 100);
  if (min === max) max = min + 10;
  const range = max - min;
  const step = range <= 50 ? 1 : range <= 500 ? 5 : range <= 5000 ? 50 : 100;
  return { min, max, step };
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") ?? undefined;
  const searchQuery = searchParams.get("q") ?? "";
  const sortParam = (searchParams.get("sort") as ProductSortBy) ?? "newest";
  const [search, setSearch] = useState(searchQuery);

  const priceMinParam = searchParams.get("minPrice");
  const priceMaxParam = searchParams.get("maxPrice");
  const inStockParam = searchParams.get("inStock");
  const saleParam = searchParams.get("sale");
  const featuredParam = searchParams.get("featured");
  const newParam = searchParams.get("new");
  const lowStockParam = searchParams.get("lowStock");
  const dealsParam = searchParams.get("deals");

  const filtersFromUrl: ProductFilters = useMemo(() => {
    const f: ProductFilters = {};
    const min = priceMinParam != null ? parseFloat(priceMinParam) : undefined;
    const max = priceMaxParam != null ? parseFloat(priceMaxParam) : undefined;
    if (min != null && !Number.isNaN(min)) f.priceMin = min;
    if (max != null && !Number.isNaN(max)) f.priceMax = max;
    if (inStockParam === "1" || inStockParam === "true") f.inStockOnly = true;
    if (saleParam === "1" || saleParam === "true") f.onSaleOnly = true;
    if (featuredParam === "1" || featuredParam === "true")
      f.featuredOnly = true;
    if (newParam === "1" || newParam === "true") f.newArrivalsOnly = true;
    if (lowStockParam === "1" || lowStockParam === "true")
      f.lowStockOnly = true;
    if (dealsParam === "1" || dealsParam === "true") f.dealsOnly = true;
    return f;
  }, [
    priceMinParam,
    priceMaxParam,
    inStockParam,
    saleParam,
    featuredParam,
    newParam,
    lowStockParam,
    dealsParam,
  ]);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (search.trim()) params.set("q", search.trim());
          else params.delete("q");
          return params;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search, setSearchParams]);

  const { settings } = useStoreSettings();
  const showOutOfStock = useMemo(
    () => parseShowOutOfStock(settings.show_out_of_stock),
    [settings.show_out_of_stock],
  );
  const enabledFilterIds = useMemo(
    () => parseProductFilters(settings.product_filters),
    [settings.product_filters],
  );
  const newArrivalsDays = useMemo(
    () => parseNewArrivalsDays(settings.new_arrivals_days),
    [settings.new_arrivals_days],
  );
  const { dealProductIds: dealProductIdsList } = useDeals();
  const dealProductIdSet = useMemo(
    () => new Set(dealProductIdsList),
    [dealProductIdsList],
  );

  const {
    products: allProducts,
    loading,
    error,
  } = useProducts({
    categorySlug,
  });
  const { categories } = useCategories();

  const priceBounds = useMemo(() => getPriceBounds(allProducts), [allProducts]);
  const { min: priceFloor, max: priceCeil, step: priceStep } = priceBounds;

  const priceMin = filtersFromUrl.priceMin ?? priceFloor;
  const priceMax = filtersFromUrl.priceMax ?? priceCeil;
  const onSaleOnly = filtersFromUrl.onSaleOnly ?? false;
  const inStockFromUrl = filtersFromUrl.inStockOnly ?? false;
  const featuredOnly = filtersFromUrl.featuredOnly ?? false;
  const newArrivalsOnly = filtersFromUrl.newArrivalsOnly ?? false;
  const lowStockOnly = filtersFromUrl.lowStockOnly ?? false;
  const dealsOnly = filtersFromUrl.dealsOnly ?? false;
  const showInStockFilter =
    showOutOfStock && enabledFilterIds.includes("in_stock");
  const inStockOnly = showOutOfStock ? inStockFromUrl : true;
  const showPriceFilter = enabledFilterIds.includes("price");
  const showSaleFilter = enabledFilterIds.includes("sale");
  const showFeaturedFilter = enabledFilterIds.includes("featured");
  const showNewArrivalsFilter = enabledFilterIds.includes("new_arrivals");
  const showLowStockFilter = enabledFilterIds.includes("low_stock");
  const showDealsFilter = enabledFilterIds.includes("deals");

  const products = useMemo(
    () =>
      filterAndSortProducts(
        allProducts,
        search,
        SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : "newest",
        {
          priceMin: priceMin !== priceFloor ? priceMin : undefined,
          priceMax: priceMax !== priceCeil ? priceMax : undefined,
          inStockOnly,
          onSaleOnly,
          featuredOnly,
          newArrivalsOnly,
          lowStockOnly,
          dealsOnly,
        },
        { newArrivalsDays, dealProductIdSet },
      ),
    [
      allProducts,
      search,
      sortParam,
      priceMin,
      priceMax,
      priceFloor,
      priceCeil,
      inStockOnly,
      onSaleOnly,
      featuredOnly,
      newArrivalsOnly,
      lowStockOnly,
      dealsOnly,
      newArrivalsDays,
      dealProductIdSet,
    ],
  );

  const suggestedExcludeIds = useMemo(
    () => products.map((p) => p.id),
    [products],
  );

  const setFilterParams = useCallback(
    (
      updates: Partial<{
        minPrice: number | null;
        maxPrice: number | null;
        inStock: boolean;
        sale: boolean;
        featured: boolean;
        new: boolean;
        lowStock: boolean;
        deals: boolean;
      }>,
    ) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if ("minPrice" in updates) {
          const v = updates.minPrice;
          if (v === null || v === priceFloor) params.delete("minPrice");
          else params.set("minPrice", String(v));
        }
        if ("maxPrice" in updates) {
          const v = updates.maxPrice;
          if (v === null || v === priceCeil) params.delete("maxPrice");
          else params.set("maxPrice", String(v));
        }
        if (updates.inStock !== undefined) {
          if (updates.inStock) params.set("inStock", "1");
          else params.delete("inStock");
        }
        if (updates.sale !== undefined) {
          if (updates.sale) params.set("sale", "1");
          else params.delete("sale");
        }
        if (updates.featured !== undefined) {
          if (updates.featured) params.set("featured", "1");
          else params.delete("featured");
        }
        if (updates.new !== undefined) {
          if (updates.new) params.set("new", "1");
          else params.delete("new");
        }
        if (updates.lowStock !== undefined) {
          if (updates.lowStock) params.set("lowStock", "1");
          else params.delete("lowStock");
        }
        if (updates.deals !== undefined) {
          if (updates.deals) params.set("deals", "1");
          else params.delete("deals");
        }
        return params;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams, priceFloor, priceCeil],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (showPriceFilter && (priceMin !== priceFloor || priceMax !== priceCeil))
      n += 1;
    if (showInStockFilter && inStockOnly) n += 1;
    if (showSaleFilter && onSaleOnly) n += 1;
    if (showFeaturedFilter && featuredOnly) n += 1;
    if (showNewArrivalsFilter && newArrivalsOnly) n += 1;
    if (showLowStockFilter && lowStockOnly) n += 1;
    if (showDealsFilter && dealsOnly) n += 1;
    return n;
  }, [
    showPriceFilter,
    showInStockFilter,
    showSaleFilter,
    showFeaturedFilter,
    showNewArrivalsFilter,
    showLowStockFilter,
    showDealsFilter,
    priceMin,
    priceMax,
    priceFloor,
    priceCeil,
    inStockOnly,
    onSaleOnly,
    featuredOnly,
    newArrivalsOnly,
    lowStockOnly,
    dealsOnly,
  ]);

  const clearAllFilters = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("inStock");
      params.delete("sale");
      params.delete("featured");
      params.delete("new");
      params.delete("lowStock");
      params.delete("deals");
      return params;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const appliedCollapseDefaultsRef = useRef(false);
  useEffect(() => {
    if (appliedCollapseDefaultsRef.current) return;
    const keys = Object.keys(settings);
    if (keys.length === 0) return;
    appliedCollapseDefaultsRef.current = true;
    const catDef = settings.categories_collapsed_by_default;
    const filDef = settings.filters_collapsed_by_default;
    setCategoriesCollapsed(
      catDef === true ||
        catDef === "true" ||
        (typeof catDef === "string" && catDef.toLowerCase() === "true"),
    );
    setFiltersCollapsed(
      filDef === true ||
        filDef === "true" ||
        (typeof filDef === "string" && filDef.toLowerCase() === "true"),
    );
  }, [settings]);

  const { products: suggested, loading: suggestedLoading } =
    useSuggestedProductsForListing(
      suggestedExcludeIds,
      categorySlug,
      !loading && !error,
    );
  const showSuggested = suggested.length > 0 || suggestedLoading;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasAnyFilter =
    showPriceFilter ||
    showInStockFilter ||
    showSaleFilter ||
    showFeaturedFilter ||
    showNewArrivalsFilter ||
    showLowStockFilter ||
    showDealsFilter;

  const filtersContent = (
    <>
      <div className="space-y-4 text-left">
        {showPriceFilter && (
          <div className="flex flex-col items-start">
            <h4 className="mb-2 text-sm font-medium text-white">Price</h4>
            <PriceRangeSlider
              min={priceFloor}
              max={priceCeil}
              valueMin={priceMin}
              valueMax={priceMax}
              step={priceStep}
              className="w-full"
              onChange={(min, max) => {
                setFilterParams({
                  minPrice: min === priceFloor ? null : min,
                  maxPrice: max === priceCeil ? null : max,
                });
              }}
              aria-label="Price range"
            />
          </div>
        )}
        {showInStockFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setFilterParams({ inStock: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">In stock only</span>
          </label>
        )}
        {showSaleFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => setFilterParams({ sale: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">On sale</span>
          </label>
        )}
        {showFeaturedFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFilterParams({ featured: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">Featured only</span>
          </label>
        )}
        {showNewArrivalsFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={newArrivalsOnly}
              onChange={(e) => setFilterParams({ new: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">
              New arrivals (last {newArrivalsDays} days)
            </span>
          </label>
        )}
        {showLowStockFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setFilterParams({ lowStock: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">Low stock</span>
          </label>
        )}
        {showDealsFilter && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={dealsOnly}
              onChange={(e) => setFilterParams({ deals: e.target.checked })}
              className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-dark"
            />
            <span className="text-sm text-brand-cream">Deals</span>
          </label>
        )}
      </div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="mt-4 w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-3 py-2 text-sm font-medium text-brand-cream hover:bg-brand-medium/30"
        >
          Clear filters
        </button>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-6 lg:px-8 w-full">
      <SEO
        title="Products & Marine Deck Materials | All On Deck"
        description="Browse our catalog of custom marine deck flooring materials, custom engravings, non-skid EVA/PE foam kits, and boat accessories."
      />
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <ProductsMobileFiltersSection
          categorySlug={categorySlug}
          categories={categories}
          onCategoryChange={(slug) => {
            const params = new URLSearchParams(searchParams);
            if (slug) params.set("category", slug);
            else params.delete("category");
            setSearchParams(params);
          }}
          hasAnyFilter={hasAnyFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          activeFilterCount={activeFilterCount}
          filtersContent={filtersContent}
        />

        <ProductsSidebarSection
          categoriesCollapsed={categoriesCollapsed}
          setCategoriesCollapsed={setCategoriesCollapsed}
          categorySlug={categorySlug}
          categories={categories}
          hasAnyFilter={hasAnyFilter}
          filtersCollapsed={filtersCollapsed}
          setFiltersCollapsed={setFiltersCollapsed}
          activeFilterCount={activeFilterCount}
          filtersContent={filtersContent}
        />

        <div className="min-w-0 flex-1">
          <ProductsHeaderControls
            search={search}
            setSearch={setSearch}
            sortParam={sortParam}
            onSortChange={(v) => {
              const params = new URLSearchParams(searchParams);
              if (v === "newest") params.delete("sort");
              else params.set("sort", v);
              setSearchParams(params);
            }}
            activeFilterCount={activeFilterCount}
            showPriceFilter={showPriceFilter}
            priceMin={priceMin}
            priceFloor={priceFloor}
            priceMax={priceMax}
            priceCeil={priceCeil}
            showInStockFilter={showInStockFilter}
            inStockOnly={inStockOnly}
            showSaleFilter={showSaleFilter}
            onSaleOnly={onSaleOnly}
            showFeaturedFilter={showFeaturedFilter}
            featuredOnly={featuredOnly}
            showNewArrivalsFilter={showNewArrivalsFilter}
            newArrivalsOnly={newArrivalsOnly}
            showLowStockFilter={showLowStockFilter}
            lowStockOnly={lowStockOnly}
            showDealsFilter={showDealsFilter}
            dealsOnly={dealsOnly}
            setFilterParams={setFilterParams}
            clearAllFilters={clearAllFilters}
          />

          <ProductsGridSection
            loading={loading}
            error={error}
            products={products}
            showSuggested={showSuggested}
            suggestedLoading={suggestedLoading}
            suggested={suggested}
          />
        </div>
      </div>
    </div>
  );
}
