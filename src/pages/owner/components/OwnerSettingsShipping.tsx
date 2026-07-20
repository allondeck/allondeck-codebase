import React from "react";
import { Button } from "../../../components/ui/Button";
import { ALL_COUNTRIES } from "../../../lib/shippingCountries";
import { SectionCard } from "../../../components/layouts/SectionCard";

interface ShippingSettingsProps {
  estimatedDelivery: string;
  setEstimatedDelivery: (v: string) => void;
  shippingCountries: string[];
  setShippingCountries: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * OwnerSettingsShipping
 * 
 * Manages the shipping and delivery settings for the store.
 * - Estimated delivery string
 * - List of available shipping countries for checkout
 */
export function OwnerSettingsShipping({
  estimatedDelivery,
  setEstimatedDelivery,
  shippingCountries,
  setShippingCountries,
}: ShippingSettingsProps) {
  const sectionHeader =
    "flex flex-wrap items-center gap-2 border-b border-brand-medium/35 pb-4 mb-4";
  const sectionTitle = "text-base font-semibold text-brand-cream";
  const sectionDesc = "text-sm text-brand-light mt-0.5 min-w-0";
  const fieldLabel = "block text-sm font-medium text-white";
  const fieldHint = "text-xs text-brand-light mt-1";

  return (
    <SectionCard>
      <div className="p-4 sm:p-6">
        {/* === SECTION HEADER === */}
        <div className={sectionHeader}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-medium/30 text-white">
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

        {/* === ESTIMATED DELIVERY FIELD === */}
        <div>
          <label className={fieldLabel}>Estimated delivery</label>
          <input
            type="text"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="mt-1.5 w-full min-h-[44px] rounded-lg bg-brand-dark border border-brand-medium/60 px-3 py-2.5 text-white placeholder-brand-light focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            placeholder="e.g. 2–3 business days"
          />
          <p className={fieldHint}>Shown on product and checkout pages.</p>
        </div>

        {/* === SHIPPING COUNTRIES LIST === */}
        <div className="mt-6 border-t border-brand-medium/35 pt-6">
          <h3 className="text-sm font-semibold text-brand-cream">
            Shipping countries
          </h3>
          <p className="mt-1 text-sm text-brand-light">
            Countries offered in the checkout address. Default: United States,
            Canada, Mexico. Remove any or add more from the list below.
          </p>

          <ul className="mb-4 mt-4 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-brand-medium/35 bg-brand-medium/15 p-3">
            {shippingCountries.map((c) => (
              <li
                key={c}
                className="flex items-center justify-between gap-2 rounded-md bg-brand-dark-alt px-3 py-2 shadow-sm border border-brand-medium/35"
              >
                <span className="text-sm font-medium text-white">{c}</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-xs text-red-400 hover:bg-red-950/20"
                  onClick={() =>
                    setShippingCountries((prev) => prev.filter((x) => x !== c))
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
                  [...prev, v].sort((a, b) => a.localeCompare(b))
                );
                e.target.value = "";
              }}
              className="min-h-[44px] min-w-[200px] rounded-lg bg-brand-dark border border-brand-medium/60 px-3 py-2 text-sm text-white focus:border-brand-orange focus:outline-none"
            >
              <option value="">Add a country…</option>
              {ALL_COUNTRIES.filter((c) => !shippingCountries.includes(c)).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
            <span className="text-xs text-brand-light">
              {ALL_COUNTRIES.length} countries available to add.
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
