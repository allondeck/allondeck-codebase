import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { supabase } from "../../lib/supabase";
import {
  createOrderFromInvoice,
  type CreateOrderFromInvoiceInput,
  type InvoiceOrderItem,
  type ShippingAddressInput,
} from "../../lib/orders";

type ProductStub = {
  id: string;
  name: string;
  price: number;
};

const emptyAddress: ShippingAddressInput = {
  full_name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};

type LineRow = { productId: string; quantity: number };

export default function OwnerOrderCreateManual() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductStub[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [lines, setLines] = useState<LineRow[]>([
    { productId: "", quantity: 1 },
  ]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressInput>(emptyAddress);
  const [discountType, setDiscountType] = useState<
    "none" | "fixed" | "percent"
  >("none");
  const [discountValue, setDiscountValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("id, name, price");
      if (fetchError) {
        setLoadingProducts(false);
        return;
      }
      setProducts(
        (data ?? []).map((p: { id: string; name: string; price: unknown }) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
        })),
      );
      setLoadingProducts(false);
    })();
  }, []);

  function addLine() {
    setLines((prev) => [...prev, { productId: "", quantity: 1 }]);
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateLine(
    idx: number,
    field: "productId" | "quantity",
    value: string | number,
  ) {
    setLines((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]: field === "quantity" ? Number(value) || 0 : value,
      };
      return next;
    });
  }

  const validItems: InvoiceOrderItem[] = lines
    .filter((row) => row.productId && row.quantity > 0)
    .map((row) => {
      const product = products.find((p) => p.id === row.productId)!;
      return {
        product: { id: product.id, name: product.name, price: product.price },
        quantity: row.quantity,
      };
    });

  const subtotal = validItems.reduce(
    (sum, i) => sum + Number(i.product?.price || 0) * i.quantity,
    0,
  );

  const rawDiscount =
    discountType === "fixed"
      ? Math.min(Math.max(0, parseFloat(discountValue) || 0), subtotal)
      : discountType === "percent"
        ? (subtotal *
            Math.min(100, Math.max(0, parseFloat(discountValue) || 0))) /
          100
        : 0;
  const discountAmount = Math.round(rawDiscount * 100) / 100;
  const total = Math.max(
    0,
    Math.round((subtotal - discountAmount) * 100) / 100,
  );

  async function handleCreate() {
    setError(null);
    if (validItems.length === 0) {
      setError("Add at least one product with quantity > 0.");
      return;
    }
    const email = customerEmail.trim();
    if (!email) {
      setError("Customer email is required.");
      return;
    }
    setCreating(true);
    try {
      const input: CreateOrderFromInvoiceInput = {
        items: validItems,
        customerEmail: email,
        shippingAddress:
          shippingAddress.line1 ||
          shippingAddress.city ||
          shippingAddress.country
            ? shippingAddress
            : undefined,
        ...(discountType === "fixed" && discountValue.trim() !== ""
          ? {
              customDiscountFixed: Math.min(
                Math.max(0, parseFloat(discountValue) || 0),
                subtotal,
              ),
            }
          : discountType === "percent" && discountValue.trim() !== ""
            ? {
                customDiscountPercent: Math.min(
                  100,
                  Math.max(0, parseFloat(discountValue) || 0),
                ),
              }
            : {}),
      };
      const orderId = await createOrderFromInvoice(input);
      navigate(`/owner/orders/${orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create order");
    } finally {
      setCreating(false);
    }
  }

  if (loadingProducts) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/owner/orders"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Orders
        </Link>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">
        Create order manually
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Add products and quantities, then enter customer details. No invoice
        file needed.
      </p>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Items</h3>
        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Product
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">
                  Qty
                </th>
                <th className="w-10 px-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lines.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">
                    <select
                      value={row.productId}
                      onChange={(e) =>
                        updateLine(idx, "productId", e.target.value)
                      }
                      className="w-full min-w-[180px] rounded border border-gray-300 px-2 py-1.5 text-sm"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ${Number(p.price).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      min={0}
                      value={row.quantity}
                      onChange={(e) =>
                        updateLine(idx, "quantity", e.target.value)
                      }
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-right text-sm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove line"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={addLine}
          className="mt-2 text-sm"
        >
          Add line
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-medium text-gray-900">
          Discount (optional)
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          One-off discount for this order only. Not a coupon.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                checked={discountType === "none"}
                onChange={() => setDiscountType("none")}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">None</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                checked={discountType === "fixed"}
                onChange={() => setDiscountType("fixed")}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Flat amount</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                checked={discountType === "percent"}
                onChange={() => setDiscountType("percent")}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Percentage</span>
            </label>
          </div>
          {discountType !== "none" && (
            <div className="flex items-center gap-2">
              {discountType === "fixed" && (
                <span className="text-sm text-gray-600">$</span>
              )}
              <input
                type="number"
                min={0}
                max={discountType === "percent" ? 100 : undefined}
                step={discountType === "percent" ? 1 : 0.01}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percent" ? "e.g. 10" : "0.00"}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                aria-label={
                  discountType === "percent"
                    ? "Discount percentage"
                    : "Discount amount"
                }
              />
              {discountType === "percent" && (
                <span className="text-sm text-gray-600">%</span>
              )}
            </div>
          )}
        </div>
        {discountType !== "none" && discountValue.trim() !== "" && (
          <p className="mt-2 text-sm text-gray-600">
            Discount: ${discountAmount.toFixed(2)}
            {discountType === "percent" &&
              ` (${Math.min(
                100,
                Math.max(0, parseFloat(discountValue) || 0),
              )}% of subtotal)`}
            {" · "}
            Total: ${total.toFixed(2)}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-medium text-gray-900">
          Customer &amp; shipping
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer email *
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={shippingAddress.full_name}
              onChange={(e) =>
                setShippingAddress((a) => ({ ...a, full_name: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Shipping name"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address line 1
            </label>
            <input
              type="text"
              value={shippingAddress.line1}
              onChange={(e) =>
                setShippingAddress((a) => ({ ...a, line1: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address line 2
            </label>
            <input
              type="text"
              value={shippingAddress.line2}
              onChange={(e) =>
                setShippingAddress((a) => ({ ...a, line2: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress((a) => ({ ...a, city: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress((a) => ({ ...a, state: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal code
              </label>
              <input
                type="text"
                value={shippingAddress.postal_code}
                onChange={(e) =>
                  setShippingAddress((a) => ({
                    ...a,
                    postal_code: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress((a) => ({ ...a, country: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress((a) => ({ ...a, phone: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <Button
          type="button"
          onClick={handleCreate}
          disabled={creating || validItems.length === 0}
        >
          {creating ? "Creating…" : "Create order"}
        </Button>
        <span className="text-sm text-gray-500">
          {discountAmount > 0 ? (
            <>
              Subtotal: ${subtotal.toFixed(2)} − ${discountAmount.toFixed(2)} =
              ${total.toFixed(2)} ({validItems.length} item
              {validItems.length !== 1 ? "s" : ""})
            </>
          ) : (
            <>
              Subtotal: ${subtotal.toFixed(2)} ({validItems.length} item
              {validItems.length !== 1 ? "s" : ""})
            </>
          )}
        </span>
      </div>
    </div>
  );
}
