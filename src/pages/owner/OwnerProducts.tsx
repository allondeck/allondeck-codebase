import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Select } from "../../components/ui/Select";
import {
  useProductsAdmin,
  type ProductSortBy,
} from "../../hooks/useProductsAdmin";
import { useCategoriesAdmin } from "../../hooks/useCategoriesAdmin";
import { formatPrice } from "../../lib/utils";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "stock_asc", label: "Stock: low to high" },
  { value: "stock_desc", label: "Stock: high to low" },
];

export default function OwnerProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lowStockParam = searchParams.get("low_stock") === "1";
  const [categoryId, setCategoryId] = useState<string>("");
  const [featured, setFeatured] = useState<string>("all"); // 'all' | 'featured'
  const [sortBy, setSortBy] = useState<ProductSortBy>("stock_asc");
  const [lowStockOnly, setLowStockOnly] = useState(lowStockParam);

  useEffect(() => {
    setLowStockOnly(lowStockParam);
  }, [lowStockParam]);

  const { products, loading, error } = useProductsAdmin({
    categoryId: categoryId || undefined,
    featured: featured === "featured" ? true : undefined,
    sortBy,
    lowStockOnly: lowStockOnly || undefined,
  });
  const { categories } = useCategoriesAdmin();

  const DEFAULT_LOW_STOCK_THRESHOLD = 10;

  function getCategoryNames(product: {
    product_categories?: { categories: { name: string } | null }[];
  }) {
    const cats = product.product_categories
      ?.map((pc) => pc.categories?.name)
      .filter(Boolean) as string[] | undefined;
    return cats?.length ? cats.join(", ") : "—";
  }

  function isLowStock(product: any): boolean {
    const threshold =
      product.low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
    
    const activeVariants = product.product_variants?.filter((v: any) => v.is_active) || [];
    if (activeVariants.length > 0) {
      return activeVariants.some((v: any) => v.stock_quantity <= threshold);
    }
    
    return product.stock_quantity <= threshold;
  }
  
  function getStockDisplay(product: any) {
    const activeVariants = product.product_variants?.filter((v: any) => v.is_active) || [];
    if (activeVariants.length > 0) {
      const totalStock = activeVariants.reduce((sum: number, v: any) => sum + v.stock_quantity, 0);
      return `${totalStock} in ${activeVariants.length} variants`;
    }
    return product.stock_quantity;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load products: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-brand-cream">Products</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full sm:w-auto sm:min-w-[140px]"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            value={featured}
            onChange={(e) => setFeatured(e.target.value)}
            className="w-full sm:w-auto sm:min-w-[140px]"
            aria-label="Filter by featured"
          >
            <option value="all">All products</option>
            <option value="featured">Featured only</option>
          </Select>
          <Select
            value={lowStockOnly ? "1" : ""}
            onChange={(e) => setLowStockOnly(e.target.value === "1")}
            className="w-full sm:w-auto sm:min-w-[140px]"
            aria-label="Filter by stock level"
          >
            <option value="">All stock</option>
            <option value="1">Low stock only</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
            className="w-full sm:w-auto sm:min-w-[160px]"
            aria-label="Sort products by"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Link
            to="/account/owner/products/import"
            className="w-full rounded-lg border border-brand-medium/35 bg-brand-dark-alt px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-medium/30 sm:w-auto"
          >
            Import stock (CSV)
          </Link>
          <Link
            to="/account/owner/products/new"
            className="w-full rounded-lg bg-brand-orange px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-orange/80 sm:w-auto"
          >
            Add product
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-brand-medium/35 bg-brand-dark-alt">
        <table className="w-full min-w-[600px] divide-y divide-brand-medium/35">
          <thead className="bg-brand-medium/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-medium/35 bg-brand-dark-alt">
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() =>
                  navigate(`/account/owner/products/${product.id}`)
                }
                className="cursor-pointer hover:bg-brand-medium/20"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-white">
                    {product.name}
                  </span>
                  {product.is_featured && (
                    <span className="ml-2 rounded bg-amber-950/40 px-1.5 py-0.5 text-xs text-brand-orange border border-amber-900/30">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-brand-light">
                  {getCategoryNames(product)}
                </td>
                <td className="px-4 py-3 text-sm text-brand-light">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      isLowStock(product)
                        ? "text-sm font-medium text-brand-orange"
                        : "text-sm text-white"
                    }
                  >
                    {getStockDisplay(product)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.is_published
                        ? "bg-green-950/40 text-green-400 border border-green-900/30"
                        : "bg-brand-medium/30 text-brand-light border border-brand-medium/35"
                    }`}
                  >
                    {product.is_published ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
        <p className="mt-6 text-center text-brand-light">No products yet.</p>
      )}
    </div>
  );
}

