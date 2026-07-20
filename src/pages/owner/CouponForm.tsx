import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { useCategoriesAdmin } from "../../hooks/useCategoriesAdmin";
import { useProductsAdmin } from "../../hooks/useProductsAdmin";
import type { CouponRow, CouponScope } from "../../types/database";

type CouponFormData = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: string;
  scope: CouponScope;
  scope_ids: string[];
  starts_at: string;
  ends_at: string;
  usage_limit: string;
};

const initial: CouponFormData = {
  code: "",
  discount_type: "percent",
  discount_value: "",
  scope: "all",
  scope_ids: [],
  starts_at: "",
  ends_at: "",
  usage_limit: "",
};

const SCOPE_OPTIONS: { value: CouponScope; label: string }[] = [
  { value: "all", label: "All items" },
  { value: "featured", label: "Featured items only" },
  { value: "categories", label: "Specific categories" },
  { value: "products", label: "Specific products" },
];

export default function CouponForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { categories } = useCategoriesAdmin();
  const { products } = useProductsAdmin();

  const [form, setForm] = useState<CouponFormData>(initial);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      void (async () => {
        const { data, error: err } = await supabase
          .from("coupons")
          .select("*")
          .eq("id", id)
          .single();
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        const c = data as CouponRow;
        setForm({
          code: c.code,
          discount_type: c.discount_type,
          discount_value: String(c.discount_value),
          scope: c.scope,
          scope_ids: Array.isArray(c.scope_ids) ? c.scope_ids : [],
          starts_at: c.starts_at ? c.starts_at.slice(0, 16) : "",
          ends_at: c.ends_at ? c.ends_at.slice(0, 16) : "",
          usage_limit: c.usage_limit != null ? String(c.usage_limit) : "",
        });
        setLoading(false);
      })();
    }
  }, [id, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const code = form.code.trim().toUpperCase();
    if (!code) {
      setError("Code is required.");
      return;
    }
    const discountValue = parseFloat(form.discount_value);
    if (isNaN(discountValue) || discountValue <= 0) {
      setError("Discount value must be a positive number.");
      return;
    }
    if (form.discount_type === "percent" && discountValue > 100) {
      setError("Percent discount cannot exceed 100.");
      return;
    }
    if (
      (form.scope === "categories" || form.scope === "products") &&
      form.scope_ids.length === 0
    ) {
      setError(
        `Select at least one ${form.scope === "categories" ? "category" : "product"}.`,
      );
      return;
    }

    setSaving(true);
    const payload = {
      code,
      discount_type: form.discount_type,
      discount_value: discountValue,
      scope: form.scope,
      scope_ids: form.scope_ids,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      usage_limit: form.usage_limit.trim()
        ? parseInt(form.usage_limit, 10)
        : null,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error: err } = await supabase.from("coupons").insert(payload);
      setSaving(false);
      if (err) {
        setError(err.message);
        return;
      }
      navigate("/account/owner/coupons");
    } else if (id) {
      const { error: err } = await supabase
        .from("coupons")
        .update(payload)
        .eq("id", id);
      setSaving(false);
      if (err) {
        setError(err.message);
        return;
      }
      navigate("/account/owner/coupons");
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this coupon? This cannot be undone.")) return;
    setSaving(true);
    const { error: err } = await supabase.from("coupons").delete().eq("id", id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/account/owner/coupons");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white">
            Code
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            placeholder="SAVE10"
            className="mt-1 w-full max-w-xs rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 font-mono focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            required
          />
          <p className="mt-1 text-xs text-brand-light">
            Customers enter this at checkout. Case-insensitive.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white">
              Discount type
            </label>
            <select
              value={form.discount_type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  discount_type: e.target.value as "percent" | "fixed",
                }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none"
            >
              <option value="percent" className="bg-brand-dark-alt text-white">Percentage off</option>
              <option value="fixed" className="bg-brand-dark-alt text-white">Fixed amount off</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Value {form.discount_type === "percent" ? "(%)" : "($)"}
            </label>
            <input
              type="number"
              min="0"
              step={form.discount_type === "percent" ? 1 : 0.01}
              max={form.discount_type === "percent" ? 100 : undefined}
              value={form.discount_value}
              onChange={(e) =>
                setForm((f) => ({ ...f, discount_value: e.target.value }))
              }
              placeholder={form.discount_type === "percent" ? "10" : "5.00"}
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Applies to
          </label>
          <select
            value={form.scope}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                scope: e.target.value as CouponScope,
                scope_ids: [],
              }))
            }
            className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none"
          >
            {SCOPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-brand-dark-alt text-white">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {form.scope === "categories" && (
          <div>
            <label className="block text-sm font-medium text-white">
              Categories
            </label>
            <p className="mt-1 text-xs text-brand-light">
              Discount applies only to items in these categories.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => {
                const checked = form.scope_ids.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-brand-medium/35 bg-brand-dark-alt text-white px-3 py-2 text-sm hover:bg-brand-medium/30"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((f) => ({
                            ...f,
                            scope_ids: [...f.scope_ids, c.id],
                          }));
                        } else {
                          setForm((f) => ({
                            ...f,
                            scope_ids: f.scope_ids.filter((x) => x !== c.id),
                          }));
                        }
                      }}
                      className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
            {categories.length === 0 && (
              <p className="mt-2 text-sm text-brand-light">
                No categories. Create categories first.
              </p>
            )}
          </div>
        )}

        {form.scope === "products" && (
          <div>
            <label className="block text-sm font-medium text-white">
              Products
            </label>
            <p className="mt-1 text-xs text-brand-light">
              Discount applies only to these products.
            </p>
            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-brand-medium/35 bg-brand-dark p-2">
              {products
                .filter((p) => p.is_published)
                .map((p) => {
                  const checked = form.scope_ids.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-white hover:bg-brand-medium/30"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm((f) => ({
                              ...f,
                              scope_ids: [...f.scope_ids, p.id],
                            }));
                          } else {
                            setForm((f) => ({
                              ...f,
                              scope_ids: f.scope_ids.filter((x) => x !== p.id),
                            }));
                          }
                        }}
                        className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
                      />
                      <span className="truncate">{p.name}</span>
                    </label>
                  );
                })}
            </div>
            {products.filter((p) => p.is_published).length === 0 && (
              <p className="mt-2 text-sm text-brand-light">
                No published products.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white">
              Start date (optional)
            </label>
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) =>
                setForm((f) => ({ ...f, starts_at: e.target.value }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              End date (optional)
            </label>
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) =>
                setForm((f) => ({ ...f, ends_at: e.target.value }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Usage limit (optional)
          </label>
          <input
            type="number"
            min="1"
            value={form.usage_limit}
            onChange={(e) =>
              setForm((f) => ({ ...f, usage_limit: e.target.value }))
            }
            placeholder="Unlimited"
            className="mt-1 w-full max-w-xs rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
          <p className="mt-1 text-xs text-brand-light">
            Leave empty for unlimited uses.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isNew ? "Create coupon" : "Save"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/account/owner/coupons")}
        >
          Cancel
        </Button>
        {!isNew && id && (
          <Button
            variant="secondary"
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="ml-auto text-red-400 border border-red-900/50 hover:bg-red-955/20 hover:text-red-300"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}

