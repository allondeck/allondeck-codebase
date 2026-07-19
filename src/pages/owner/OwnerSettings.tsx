import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { supabase } from "../../lib/supabase";
import {
  deleteStorageFileIfOurs,
  cleanupAllOrphanedStorage,
  MAX_IMAGE_SIZE_STORE,
  getMaxImageSizeLabel,
  isImageSizeWithinLimit,
} from "../../lib/storage";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { useCategories } from "../../hooks/useCategories";
import {
  DASHBOARD_WIDGETS,
  DASHBOARD_OVERVIEW_LIMITS,
  parseDashboardWidgets,
  WIDGET_CATEGORY_LABELS,
  type DashboardWidgetId,
} from "../../lib/dashboardWidgets";
import {
  parseProductFilters,
  parseShowOutOfStock,
  parseNewArrivalsDays,
  DEFAULT_NEW_ARRIVALS_DAYS,
  PRODUCT_FILTER_IDS,
  PRODUCT_FILTER_LABELS,
  type ProductFilterId,
} from "../../lib/productFilters";
import {
  DEFAULT_SHIPPING_COUNTRIES,
  parseShippingCountries,
  ALL_COUNTRIES,
} from "../../lib/shippingCountries";

function parseSettingString(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.replace(/^"|"$/g, "").trim();
  return "";
}

function parseBoolean(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "true";
  return false;
}

function parseFooterCategories(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v))
    return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

const MAX_FOOTER_CATEGORIES = 3;

export default function OwnerSettings() {
  const navigate = useNavigate();
  const { settings, loading, error } = useStoreSettings();
  const { categories } = useCategories();
  const [storeName, setStoreName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUrlInput, setLogoUrlInput] = useState("");
  const [showStoreNameInNav, setShowStoreNameInNav] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidgetId[]>(
    [],
  );
  const [footerCategorySlugs, setFooterCategorySlugs] = useState<string[]>([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [productFilters, setProductFilters] = useState<ProductFilterId[]>([]);
  const [newArrivalsDays, setNewArrivalsDays] = useState(
    DEFAULT_NEW_ARRIVALS_DAYS,
  );
  const [categoriesCollapsedByDefault, setCategoriesCollapsedByDefault] =
    useState(false);
  const [filtersCollapsedByDefault, setFiltersCollapsedByDefault] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [draggedWidgetId, setDraggedWidgetId] =
    useState<DashboardWidgetId | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] =
    useState<DashboardWidgetId | null>(null);
  const [shippingCountries, setShippingCountries] = useState<string[]>(
    DEFAULT_SHIPPING_COUNTRIES,
  );
  const [aiInstructions, setAiInstructions] = useState("");

  useEffect(() => {
    setStoreName(parseSettingString(settings.store_name));
    setLogoUrl(parseSettingString(settings.logo_url));
    setShowStoreNameInNav(parseBoolean(settings.show_store_name_in_nav));
    setDashboardWidgets(parseDashboardWidgets(settings.dashboard_widgets));
    setFooterCategorySlugs(
      parseFooterCategories(settings.footer_categories).filter((slug) =>
        categories.some((c) => c.slug === slug),
      ),
    );
    setEstimatedDelivery(parseSettingString(settings.estimated_delivery));
    setShowOutOfStock(parseShowOutOfStock(settings.show_out_of_stock));
    setProductFilters(parseProductFilters(settings.product_filters));
    setNewArrivalsDays(parseNewArrivalsDays(settings.new_arrivals_days));
    setCategoriesCollapsedByDefault(
      parseBoolean(settings.categories_collapsed_by_default),
    );
    setFiltersCollapsedByDefault(
      parseBoolean(settings.filters_collapsed_by_default),
    );
    const parsed = parseShippingCountries(settings.shipping_countries);
    setShippingCountries(
      parsed.length > 0 ? parsed : [...DEFAULT_SHIPPING_COUNTRIES],
    );
    setAiInstructions(parseSettingString(settings.ai_instructions));
  }, [
    settings.store_name,
    settings.logo_url,
    settings.show_store_name_in_nav,
    settings.dashboard_widgets,
    settings.footer_categories,
    categories,
    settings.estimated_delivery,
    settings.show_out_of_stock,
    settings.product_filters,
    settings.new_arrivals_days,
    settings.categories_collapsed_by_default,
    settings.filters_collapsed_by_default,
    settings.shipping_countries,
    settings.ai_instructions,
  ]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setSaveError("Please upload a JPEG, PNG, WebP, GIF, or SVG image.");
      return;
    }
    if (!isImageSizeWithinLimit(file, MAX_IMAGE_SIZE_STORE)) {
      setSaveError(
        `Logo must be under ${getMaxImageSizeLabel(MAX_IMAGE_SIZE_STORE)}.`,
      );
      return;
    }
    setSaveError(null);
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `logo.${ext}`;
    const { data, error: err } = await supabase.storage
      .from("store")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });
    setUploading(false);
    e.target.value = "";
    if (err) {
      setSaveError(err.message);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("store")
      .getPublicUrl(data.path);
    setLogoUrl(urlData.publicUrl);
    setLogoUrlInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    const oldLogo = parseSettingString(settings.logo_url);
    const updates = [
      {
        key: "store_name",
        value: JSON.stringify(storeName),
        updated_at: new Date().toISOString(),
      },
      {
        key: "logo_url",
        value: JSON.stringify(logoUrl),
        updated_at: new Date().toISOString(),
      },
      {
        key: "show_store_name_in_nav",
        value: JSON.stringify(showStoreNameInNav),
        updated_at: new Date().toISOString(),
      },
      {
        key: "dashboard_widgets",
        value: JSON.stringify(dashboardWidgets),
        updated_at: new Date().toISOString(),
      },
      {
        key: "footer_categories",
        value: footerCategorySlugs,
        updated_at: new Date().toISOString(),
      },
      {
        key: "estimated_delivery",
        value: JSON.stringify(estimatedDelivery.trim()),
        updated_at: new Date().toISOString(),
      },
      {
        key: "show_out_of_stock",
        value: JSON.stringify(showOutOfStock),
        updated_at: new Date().toISOString(),
      },
      {
        key: "product_filters",
        value: JSON.stringify(productFilters),
        updated_at: new Date().toISOString(),
      },
      {
        key: "new_arrivals_days",
        value: JSON.stringify(newArrivalsDays),
        updated_at: new Date().toISOString(),
      },
      {
        key: "categories_collapsed_by_default",
        value: JSON.stringify(categoriesCollapsedByDefault),
        updated_at: new Date().toISOString(),
      },
      {
        key: "filters_collapsed_by_default",
        value: JSON.stringify(filtersCollapsedByDefault),
        updated_at: new Date().toISOString(),
      },
      {
        key: "shipping_countries",
        value: JSON.stringify(shippingCountries),
        updated_at: new Date().toISOString(),
      },
      {
        key: "ai_instructions",
        value: JSON.stringify(aiInstructions),
        updated_at: new Date().toISOString(),
      },
    ];
    const { error: err } = await supabase
      .from("store_settings")
      .upsert(updates, {
        onConflict: "key",
      });
    setSaving(false);
    if (err) {
      setSaveError(err.message);
      return;
    }
    if (oldLogo && oldLogo !== logoUrl) {
      await deleteStorageFileIfOurs("store", oldLogo);
    }
    navigate("/account/owner");
  }

  async function handleCleanup() {
    setCleanupResult(null);
    setCleaning(true);
    const { productsDeleted, storeDeleted, errors } =
      await cleanupAllOrphanedStorage();
    setCleaning(false);
    const total = productsDeleted + storeDeleted;
    setCleanupResult(
      errors.length > 0
        ? `Error: ${errors.join(", ")}`
        : total > 0
          ? `Removed ${total} unused file(s) (${productsDeleted} product images, ${storeDeleted} logo/store).`
          : "No unused files to remove.",
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load settings: {error.message}
      </div>
    );
  }

  const sectionCard = "rounded-xl border border-[#066175]/35 bg-[#052631] shadow-sm";
  const sectionHeader =
    "flex flex-wrap items-center gap-2 border-b border-[#066175]/35 pb-4 mb-4";
  const sectionTitle = "text-base font-semibold text-[#f6ebd4]";
  const sectionDesc = "text-sm text-[#76abbf] mt-0.5 min-w-0";
  const fieldLabel = "block text-sm font-medium text-white";
  const fieldHint = "text-xs text-[#76abbf] mt-1";

  return (
    <div className="w-full max-w-[1400px] px-6 lg:px-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-[#f6ebd4] sm:text-2xl">
          Store settings
        </h1>
        <p className="mt-1 text-sm text-[#76abbf]">
          Manage your store name, logo, storefront options, and dashboard.
          Changes take effect after you save.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {saveError && (
          <div className="rounded-lg bg-red-950/40 p-4 text-sm text-red-400 border border-red-900/55 break-words">
            {saveError}
          </div>
        )}



        {/* Shipping & info */}
        <section className={sectionCard}>
          <div className="p-4 sm:p-6">
            <div className={sectionHeader}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#066175]/30 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V6a1 1 0 00-1-1H9a1 1 0 00-1 1v8a1 1 0 001 1h1"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={sectionTitle}>Shipping & delivery</h2>
                <p className={sectionDesc}>
                  Information shown to customers about delivery times.
                </p>
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Estimated delivery</label>
              <input
                type="text"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-lg bg-[#044155] border border-[#066175]/60 px-3 py-2.5 text-white placeholder-[#76abbf] focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
                placeholder="e.g. 2–3 business days"
              />
              <p className={fieldHint}>Shown on product and checkout pages.</p>
            </div>
            <div className="mt-6 border-t border-[#066175]/35 pt-6">
              <h3 className="text-sm font-semibold text-[#f6ebd4]">
                Shipping countries
              </h3>
              <p className="mt-1 text-sm text-[#76abbf]">
                Countries offered in the checkout address. Default: United
                States, Canada, Mexico. Remove any or add more from the list
                below.
              </p>
              <ul className="mb-4 mt-4 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[#066175]/35 bg-[#066175]/15 p-3">
                {shippingCountries.map((c) => (
                  <li
                    key={c}
                    className="flex items-center justify-between gap-2 rounded-md bg-[#052631] px-3 py-2 shadow-sm border border-[#066175]/35"
                  >
                    <span className="text-sm font-medium text-white">
                      {c}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-xs text-red-400 hover:bg-red-950/20"
                      onClick={() =>
                        setShippingCountries((prev) =>
                          prev.filter((x) => x !== c),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="add-shipping-country" className="sr-only">
                  Add country
                </label>
                <select
                  id="add-shipping-country"
                  value=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    if (shippingCountries.includes(v)) return;
                    setShippingCountries((prev) =>
                      [...prev, v].sort((a, b) => a.localeCompare(b)),
                    );
                    e.target.value = "";
                  }}
                  className="min-h-[44px] min-w-[200px] rounded-lg bg-[#044155] border border-[#066175]/60 px-3 py-2 text-sm text-white focus:border-[#e38622] focus:outline-none"
                >
                  <option value="">Add a country…</option>
                  {ALL_COUNTRIES.filter(
                    (c) => !shippingCountries.includes(c),
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#76abbf]">
                  {ALL_COUNTRIES.length} countries available to add.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Storefront: product listing + footer */}
        <section className={sectionCard}>
          <div className="p-4 sm:p-6">
            <div className={sectionHeader}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#066175]/30 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={sectionTitle}>Storefront</h2>
                <p className={sectionDesc}>
                  How products and categories appear to customers on the public
                  site.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border border-[#066175]/35 bg-[#066175]/15 p-4">
                <h3 className="text-sm font-semibold text-[#f6ebd4]">
                  Product listing
                </h3>
                <p className="mt-1 text-xs text-[#76abbf]">
                  Out-of-stock visibility and which filters appear on the
                  Products page.
                </p>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#066175]/35 bg-[#052631] p-3">
                  <input
                    type="checkbox"
                    checked={showOutOfStock}
                    onChange={(e) => setShowOutOfStock(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#066175]/60 bg-[#044155] text-[#e38622] focus:ring-[#e38622]"
                  />
                  <span className="text-sm text-white">
                    Show out-of-stock items. When off, only in-stock items are
                    shown and the &quot;In stock only&quot; filter is hidden.
                  </span>
                </label>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white">
                    New arrivals – number of days
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={newArrivalsDays}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isNaN(v))
                        setNewArrivalsDays(Math.max(1, Math.min(365, v)));
                    }}
                    className="mt-1 w-24 min-h-[44px] rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2 text-sm focus:border-[#e38622] focus:outline-none"
                  />
                  <p className="mt-0.5 text-xs text-[#76abbf]">
                    Products added within this many days show when customers use
                    the &quot;New arrivals&quot; filter (default{" "}
                    {DEFAULT_NEW_ARRIVALS_DAYS}).
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-white">
                    Sidebar collapsed by default
                  </p>
                  <p className="mt-0.5 text-xs text-[#76abbf]">
                    When enabled, Categories and Filters start collapsed on the
                    Products page.
                  </p>
                  <label className="mt-2 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoriesCollapsedByDefault}
                      onChange={(e) =>
                        setCategoriesCollapsedByDefault(e.target.checked)
                      }
                      className="h-4 w-4 rounded border-[#066175]/60 bg-[#044155] text-[#e38622]"
                    />
                    <span className="text-sm text-white">
                      Categories collapsed by default
                    </span>
                  </label>
                  <label className="mt-1 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filtersCollapsedByDefault}
                      onChange={(e) =>
                        setFiltersCollapsedByDefault(e.target.checked)
                      }
                      className="h-4 w-4 rounded border-[#066175]/60 bg-[#044155] text-[#e38622]"
                    />
                    <span className="text-sm text-white">
                      Filters collapsed by default
                    </span>
                  </label>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-white">
                    Filters to show on the Products page
                  </p>
                  <p className="mt-0.5 text-xs text-[#76abbf]">
                    &quot;In stock only&quot; is only available when
                    out-of-stock items are shown above.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRODUCT_FILTER_IDS.map((id) => {
                      const enabled = productFilters.includes(id);
                      const isInStock = id === "in_stock";
                      const disabled = isInStock && !showOutOfStock;
                      return (
                        <label
                          key={id}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                            disabled
                              ? "cursor-not-allowed border-[#066175]/10 bg-[#066175]/10 text-[#76abbf]"
                              : "border-[#066175]/35 bg-[#052631] text-white hover:bg-[#066175]/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={enabled}
                            disabled={disabled}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductFilters((prev) =>
                                  prev.includes(id) ? prev : [...prev, id],
                                );
                              } else {
                                setProductFilters((prev) =>
                                  prev.filter((f) => f !== id),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-[#066175]/60 bg-[#044155] text-[#e38622]"
                          />
                          {PRODUCT_FILTER_LABELS[id]}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store Assistant 
        <section className={sectionCard}>
          <div className="p-4 sm:p-6">
            <div className={sectionHeader}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#066175]/30 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={sectionTitle}>Store Assistant (AI)</h2>
                <p className={sectionDesc}>
                  Customize how the AI chatbot interacts with your customers.
                </p>
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Custom AI Instructions</label>
              <textarea
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="e.g. You are a helpful assistant for exactly these brands... You must never offer discounts unless asked about 'SUMMER25'. You must use a friendly, enthusiastic tone."
                rows={5}
                className="mt-1.5 w-full rounded-lg bg-[#044155] border border-[#066175]/60 px-3 py-2.5 text-sm text-white placeholder-[#76abbf] focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
              />
              <p className={fieldHint}>
                These instructions will be given directly to the AI to guide its
                behavior, tone, and specific knowledge about your store.
              </p>
            </div>
          </div>
        </section>
        */}

        {/* Dashboard */}
        <section className={sectionCard}>
          <div className="p-4 sm:p-6">
            <div className={sectionHeader}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#066175]/30 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={sectionTitle}>Dashboard widgets</h2>
                <p className={sectionDesc}>
                  Choose which widgets appear on the overview.
                </p>
              </div>
            </div>
            <p className={`${sectionDesc} mb-4`}>
              Max {DASHBOARD_OVERVIEW_LIMITS.stats} metrics,{" "}
              {DASHBOARD_OVERVIEW_LIMITS.charts} charts,{" "}
              {DASHBOARD_OVERVIEW_LIMITS.lists} lists. View all anytime.
            </p>
            <div className="mb-4">
              <Link
                to="/account/owner/widgets"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#066175]/35 bg-[#052631] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#066175]/30"
              >
                See all metrics
              </Link>
            </div>
            {/* Single list: order = display order; toggle = on dashboard or not */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#76abbf]">
              <p>Drag to set order. Switch on to show on the overview.</p>
            </div>
            <ul className="space-y-1.5" role="list">
              {(() => {
                const enabledSet = new Set(dashboardWidgets);
                const disabledIds = DASHBOARD_WIDGETS.map((w) => w.id).filter(
                  (id) => !enabledSet.has(id),
                );
                const combinedList = [...dashboardWidgets, ...disabledIds];
                const enabledCountByCategory: Record<string, number> = {};
                const getCategory = (id: string) =>
                  DASHBOARD_WIDGETS.find((w) => w.id === id)?.category ?? "";
                combinedList.forEach((id) => {
                  const cat = getCategory(id);
                  if (enabledSet.has(id) && cat)
                    enabledCountByCategory[cat] =
                      (enabledCountByCategory[cat] ?? 0) + 1;
                });
                return combinedList.map((widgetId) => {
                  const meta = DASHBOARD_WIDGETS.find((w) => w.id === widgetId);
                  const label = meta?.label ?? widgetId;
                  const categoryLabel =
                    meta?.category &&
                    (WIDGET_CATEGORY_LABELS[meta.category] ?? meta.category);
                  const enabled = enabledSet.has(widgetId);
                  const category = getCategory(widgetId);
                  const cap = category
                    ? DASHBOARD_OVERVIEW_LIMITS[
                        category as keyof typeof DASHBOARD_OVERVIEW_LIMITS
                      ]
                    : 0;
                  const currentInCategory = category
                    ? (enabledCountByCategory[category] ?? 0)
                    : 0;
                  const cannotEnable =
                    !enabled && cap > 0 && currentInCategory >= cap;
                  return (
                    <li
                      key={widgetId}
                      draggable
                      onDragStart={() => setDraggedWidgetId(widgetId)}
                      onDragEnd={() => {
                        setDraggedWidgetId(null);
                        setDragOverWidgetId(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedWidgetId && draggedWidgetId !== widgetId)
                          setDragOverWidgetId(widgetId);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!draggedWidgetId || draggedWidgetId === widgetId)
                          return;
                        const fromEnabled = enabledSet.has(draggedWidgetId);
                        const toEnabled = enabledSet.has(widgetId);
                        const fromMeta = DASHBOARD_WIDGETS.find(
                          (w) => w.id === draggedWidgetId,
                        );
                        const toCat = fromMeta?.category;
                        const toCap = toCat
                          ? DASHBOARD_OVERVIEW_LIMITS[
                              toCat as keyof typeof DASHBOARD_OVERVIEW_LIMITS
                            ]
                          : 0;
                        const toCurrent = toCat
                          ? (enabledCountByCategory[toCat] ?? 0)
                          : 0;
                        if (fromEnabled && toEnabled) {
                           const fromIdx =
                            dashboardWidgets.indexOf(draggedWidgetId);
                          const toIdx = dashboardWidgets.indexOf(widgetId);
                          if (fromIdx < 0 || toIdx < 0) return;
                          const next = dashboardWidgets.filter(
                            (id) => id !== draggedWidgetId,
                          );
                          const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
                          next.splice(
                            insertAt,
                            0,
                            draggedWidgetId as DashboardWidgetId,
                          );
                          setDashboardWidgets(next);
                        } else if (fromEnabled && !toEnabled) {
                          setDashboardWidgets((prev) =>
                            prev.filter((id) => id !== draggedWidgetId),
                          );
                        } else if (!fromEnabled && toEnabled) {
                          if (toCap > 0 && toCurrent >= toCap) return;
                          const toIdx = dashboardWidgets.indexOf(widgetId);
                          const next = [...dashboardWidgets];
                          next.splice(
                            toIdx,
                            0,
                            draggedWidgetId as DashboardWidgetId,
                          );
                          setDashboardWidgets(next);
                        }
                        setDraggedWidgetId(null);
                        setDragOverWidgetId(null);
                      }}
                      className={`flex flex-wrap select-none items-center gap-2 sm:gap-3 rounded-lg border-2 bg-[#052631] px-3 py-2.5 sm:py-2 text-sm transition min-h-[48px] ${
                        draggedWidgetId === widgetId ? "opacity-60" : ""
                      } ${
                        dragOverWidgetId === widgetId
                          ? "border-[#e38622] ring-2 ring-[#e38622]/20"
                          : enabled
                            ? "border-[#066175]/60 bg-[#066175]/25"
                            : "border-[#066175]/20 hover:border-[#066175]/60"
                      }`}
                    >
                      <span
                        className="flex shrink-0 cursor-grab touch-none text-[#76abbf] hover:text-white"
                        aria-label="Drag to reorder"
                        title="Drag to reorder"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium text-white">
                        {label}
                      </span>
                      {categoryLabel && (
                        <span className="shrink-0 rounded bg-[#066175]/30 px-2 py-0.5 text-xs text-[#76abbf]">
                          {categoryLabel}
                        </span>
                      )}
                      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          disabled={cannotEnable}
                          onChange={() => {
                            if (enabled) {
                              setDashboardWidgets((prev) =>
                                prev.filter((id) => id !== widgetId),
                              );
                            } else if (!cannotEnable) {
                              setDashboardWidgets((prev) => [
                                ...prev,
                                widgetId as DashboardWidgetId,
                              ]);
                            }
                          }}
                          className="peer sr-only"
                          aria-label={`${
                            enabled ? "Hide" : "Show"
                          } ${label} on dashboard`}
                        />
                        <span
                          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-[#e38622] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#e38622] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${
                            enabled ? "bg-[#e38622]" : "bg-[#044155] border border-[#066175]/60"
                          }`}
                          title={
                            cannotEnable
                              ? `Max ${cap} ${
                                  categoryLabel ?? category
                                } on overview`
                              : undefined
                          }
                        />
                      </label>
                    </li>
                  );
                });
              })()}
            </ul>
          </div>
        </section>

        {/* Maintenance */}
        <section className={sectionCard}>
          <div className="p-4 sm:p-6">
            <div className={sectionHeader}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#066175]/30 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={sectionTitle}>Maintenance</h2>
                <p className={sectionDesc}>
                  Remove unused files from storage to free space.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCleanup}
                disabled={cleaning}
                className="w-full sm:w-auto min-h-[44px]"
              >
                {cleaning ? "Cleaning..." : "Clean up unused storage"}
              </Button>
              {cleanupResult && (
                <p className="text-sm text-[#76abbf]">{cleanupResult}</p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-4 border-t border-[#066175]/35 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="submit"
            disabled={saving}
            className="w-full min-h-[44px] sm:w-auto"
          >
            {saving ? "Saving..." : "Save all settings"}
          </Button>
          <p className="text-sm text-[#76abbf] sm:max-w-sm">
            Save to apply changes to store identity, storefront, and dashboard.
          </p>
        </div>
      </form>
    </div>
  );
}
