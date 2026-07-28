import { Link } from "react-router-dom";

interface ProductsSidebarSectionProps {
  categoriesCollapsed: boolean;
  setCategoriesCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  categorySlug?: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  hasAnyFilter: boolean;
  filtersCollapsed: boolean;
  setFiltersCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterCount: number;
  filtersContent: React.ReactNode;
}

export function ProductsSidebarSection({
  categoriesCollapsed,
  setCategoriesCollapsed,
  categorySlug,
  categories,
  hasAnyFilter,
  filtersCollapsed,
  setFiltersCollapsed,
  activeFilterCount,
  filtersContent,
}: ProductsSidebarSectionProps) {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="border-b border-brand-medium/35 pb-4">
        <button
          type="button"
          onClick={() => setCategoriesCollapsed((c) => !c)}
          className="flex w-full items-center justify-between rounded-lg py-1 text-left font-semibold text-white hover:bg-brand-medium/30"
          aria-expanded={!categoriesCollapsed}
        >
          <span>Categories</span>
          <svg
            className={`h-5 w-5 shrink-0 text-brand-light transition-transform ${
              categoriesCollapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {!categoriesCollapsed && (
          <nav className="mt-2 space-y-1">
            <Link
              to="/products"
              className={`block rounded-lg px-3 py-2 text-sm ${
                !categorySlug
                  ? "bg-brand-medium/30 font-medium text-brand-orange"
                  : "text-brand-cream hover:bg-brand-medium/30 hover:text-white"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  categorySlug === cat.slug
                    ? "bg-brand-medium/30 font-medium text-brand-orange"
                    : "text-brand-cream hover:bg-brand-medium/30 hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {hasAnyFilter && (
        <div className="mt-4 pt-4">
          <button
            type="button"
            onClick={() => setFiltersCollapsed((c) => !c)}
            className="flex w-full items-center gap-2 rounded-lg py-1 text-left font-semibold text-white hover:bg-brand-medium/30"
            aria-expanded={!filtersCollapsed}
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
            <svg
              className={`ml-auto h-5 w-5 shrink-0 text-brand-light transition-transform ${
                filtersCollapsed ? "" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {!filtersCollapsed && <div className="mt-4">{filtersContent}</div>}
        </div>
      )}
    </aside>
  );
}
