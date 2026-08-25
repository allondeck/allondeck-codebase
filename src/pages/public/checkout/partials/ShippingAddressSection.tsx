import type { ShippingAddressInput } from "../../../../lib/orders";

function capitalizeWords(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

interface ShippingAddressSectionProps {
  address: ShippingAddressInput;
  countryOptions: string[];
  setAddress: React.Dispatch<React.SetStateAction<ShippingAddressInput>>;
}

export function ShippingAddressSection({
  address,
  countryOptions,
  setAddress,
}: ShippingAddressSectionProps) {
  return (
    <div className="mb-6 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
      <h2 className="mb-4 font-semibold text-white">Shipping address</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-brand-cream"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="full_name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={address.full_name || ""}
            onChange={(e) =>
              setAddress((a) => ({ ...a, full_name: e.target.value }))
            }
            onBlur={(e) =>
              setAddress((a) => ({
                ...a,
                full_name: capitalizeWords(e.target.value),
              }))
            }
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label
            htmlFor="line1"
            className="block text-sm font-medium text-brand-cream"
          >
            Address line 1 <span className="text-red-500">*</span>
          </label>
          <input
            id="line1"
            name="address-line1"
            type="text"
            autoComplete="address-line1"
            required
            value={address.line1 || ""}
            onChange={(e) =>
              setAddress((a) => ({ ...a, line1: e.target.value }))
            }
            onBlur={(e) =>
              setAddress((a) => ({
                ...a,
                line1: capitalizeWords(e.target.value),
              }))
            }
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label
            htmlFor="line2"
            className="block text-sm font-medium text-brand-cream"
          >
            Address line 2 <span className="text-brand-light/60">(optional)</span>
          </label>
          <input
            id="line2"
            name="address-line2"
            type="text"
            autoComplete="address-line2"
            value={address.line2 || ""}
            onChange={(e) =>
              setAddress((a) => ({ ...a, line2: e.target.value }))
            }
            onBlur={(e) =>
              setAddress((a) => ({
                ...a,
                line2: capitalizeWords(e.target.value),
              }))
            }
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            placeholder="Apt 4"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-brand-cream"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="address-level2"
              type="text"
              autoComplete="address-level2"
              required
              value={address.city}
              onChange={(e) =>
                setAddress((a) => ({ ...a, city: e.target.value }))
              }
              onBlur={(e) =>
                setAddress((a) => ({
                  ...a,
                  city: capitalizeWords(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
              placeholder="New York"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-brand-cream"
            >
              State / Province <span className="text-red-500">*</span>
            </label>
            <input
              id="state"
              name="address-level1"
              type="text"
              autoComplete="address-level1"
              required
              value={address.state}
              onChange={(e) =>
                setAddress((a) => ({ ...a, state: e.target.value }))
              }
              onBlur={(e) =>
                setAddress((a) => ({
                  ...a,
                  state: capitalizeWords(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
              placeholder="NY"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="postal_code"
              className="block text-sm font-medium text-brand-cream"
            >
              Postal code <span className="text-red-500">*</span>
            </label>
            <input
              id="postal_code"
              name="postal-code"
              type="text"
              autoComplete="postal-code"
              inputMode="numeric"
              required
              value={address.postal_code || ""}
              onChange={(e) =>
                setAddress((a) => ({ ...a, postal_code: e.target.value }))
              }
              onBlur={(e) =>
                setAddress((a) => ({
                  ...a,
                  postal_code: capitalizeWords(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
              placeholder="10001"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-brand-cream"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              autoComplete="country"
              required
              value={
                countryOptions.includes(address.country)
                  ? address.country
                  : ""
              }
              onChange={(e) =>
                setAddress((a) => ({ ...a, country: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            >
              <option value="">Select country</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-brand-cream"
          >
            Phone <span className="text-brand-light/60">(optional)</span>
          </label>
          <input
            id="phone"
            name="tel"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={address.phone || ""}
            onChange={(e) =>
              setAddress((a) => ({ ...a, phone: e.target.value }))
            }
            onBlur={(e) =>
              setAddress((a) => ({
                ...a,
                phone: capitalizeWords(e.target.value),
              }))
            }
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>
    </div>
  );
}
