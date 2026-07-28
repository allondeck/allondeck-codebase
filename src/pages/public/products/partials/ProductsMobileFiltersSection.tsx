import { Select } from "../../../../components/ui/Select";

interface ProductsMobileFiltersSectionProps {
  categorySlug?: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  onCategoryChange: (slug: string) => void;
  hasAnyFilter: boolean;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterCount: number;
  filtersContent: React.ReactNode;
}

export function ProductsMobileFiltersSection({
  categorySlug,
  categories,
  onCategoryChange,
  hasAnyFilter,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  activeFilterCount,
  filtersContent,
}: ProductsMobileFiltersSectionProps) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div>
        <label
          htmlFor="category-mobile"
          className="mb-2 block text-sm font-medium text-brand-cream"
        >
          Category
        </label>
        <Select
          id="category-mobile"
          value={categorySlug ?? ""}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full"
        >
          <option value="">All products</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>
      {hasAnyFilter && (
        <div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-4 py-2.5 text-sm font-medium text-brand-cream hover:bg-brand-medium/30"
          >
            <span>Filters</span>
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          {mobileFiltersOpen && (
            <div className="mt-2 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-4">
              {filtersContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
