import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import {
  deleteStorageFileIfOurs,
  MAX_IMAGE_SIZE_PRODUCTS,
  getMaxImageSizeLabel,
  isImageSizeWithinLimit,
} from "../../lib/storage";
import { useCategoriesAdmin } from "../../hooks/useCategoriesAdmin";
import { slugify } from "../../lib/utils";
import type { ProductRow } from "../../types/database";

const MAX_CATEGORIES = 3;

type VariantFormData = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  compare_at_price: string;
  stock_quantity: string;
  is_default: boolean;
  image_url: string;
};

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string;
  sku: string;
  stock_quantity: string;
  low_stock_threshold: string;
  is_published: boolean;
  is_featured: boolean;
  category_ids: string[];
  image_url: string;
  variants: VariantFormData[];
};

const initial: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compare_at_price: "",
  sku: "",
  stock_quantity: "0",
  low_stock_threshold: "",
  is_published: false,
  is_featured: false,
  category_ids: [],
  image_url: "",
  variants: [],
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { categories } = useCategoriesAdmin();

  const [form, setForm] = useState<ProductFormData>(initial);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      void (async () => {
        const { data: productData, error: productErr } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (productErr) {
          setError(productErr.message);
          setLoading(false);
          return;
        }
        const p = productData as ProductRow;
        const { data: pcData } = await supabase
          .from("product_categories")
          .select("category_id")
          .eq("product_id", id)
          .order("sort_order", { ascending: true });
        const categoryIds = (pcData ?? []).map(
          (r) => (r as { category_id: string }).category_id,
        );

        const { data: variantsData } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", id)
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description ?? "",
          price: String(parseFloat(String(p.price))),
          compare_at_price:
            p.compare_at_price != null
              ? String(parseFloat(String(p.compare_at_price)))
              : "",
          sku: p.sku ?? "",
          stock_quantity: String(p.stock_quantity),
          low_stock_threshold:
            p.low_stock_threshold != null ? String(p.low_stock_threshold) : "",
          is_published: p.is_published,
          is_featured: p.is_featured,
          category_ids: categoryIds,
          image_url: p.image_url ?? "",
          variants: (variantsData || []).map((v: any) => ({
            id: v.id,
            name: v.name,
            sku: v.sku || "",
            price: v.price ? String(v.price) : "",
            compare_at_price: v.compare_at_price ? String(v.compare_at_price) : "",
            stock_quantity: String(v.stock_quantity),
            is_default: v.is_default,
            image_url: v.image_url || "",
          })),
        });
        setLoading(false);
      })();
    }
  }, [id, isNew]);

  useEffect(() => {
    if (autoSlug && form.name) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, autoSlug]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (!isImageSizeWithinLimit(file, MAX_IMAGE_SIZE_PRODUCTS)) {
      setError(
        `Image must be under ${getMaxImageSizeLabel(MAX_IMAGE_SIZE_PRODUCTS)}.`,
      );
      return;
    }
    setError(null);
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { data, error: err } = await supabase.storage
      .from("products")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
    setUploading(false);
    e.target.value = "";
    if (err) {
      setError(err.message);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
  }

  async function handleVariantFileUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (!isImageSizeWithinLimit(file, MAX_IMAGE_SIZE_PRODUCTS)) {
      setError(
        `Image must be under ${getMaxImageSizeLabel(MAX_IMAGE_SIZE_PRODUCTS)}.`,
      );
      return;
    }
    setError(null);
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { data, error: err } = await supabase.storage
      .from("products")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
    setUploading(false);
    e.target.value = "";
    if (err) {
      setError(err.message);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);
    setForm((f) => {
      const newVariants = [...f.variants];
      newVariants[index].image_url = urlData.publicUrl;
      return { ...f, variants: newVariants };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    let oldImageUrl: string | null = null;
    if (!isNew && id) {
      const { data } = await supabase
        .from("products")
        .select("image_url")
        .eq("id", id)
        .single();
      oldImageUrl =
        (data as { image_url?: string | null } | null)?.image_url ?? null;
    }
    const primaryCategoryId = form.category_ids[0] || null;
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price
        ? parseFloat(form.compare_at_price)
        : null,
      sku: form.sku || null,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      low_stock_threshold: form.low_stock_threshold
        ? parseInt(form.low_stock_threshold, 10)
        : null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      image_url: form.image_url || null,
      category_id: primaryCategoryId,
    };
    if (isNew) {
      const { data: inserted, error: err } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (err) {
        setSaving(false);
        setError(err.message);
        return;
      }
      const productId = (inserted as { id: string }).id;
      if (form.category_ids.length > 0) {
        await supabase.from("product_categories").insert(
          form.category_ids.map((cid, i) => ({
            product_id: productId,
            category_id: cid,
            sort_order: i,
          })) as never,
        );
      }
      
      for (const v of form.variants) {
        await supabase.from("product_variants").insert({
          product_id: productId,
          name: v.name,
          sku: v.sku || null,
          price: v.price ? parseFloat(v.price) : null,
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock_quantity: parseInt(v.stock_quantity, 10) || 0,
          is_default: v.is_default,
          image_url: v.image_url || null,
          is_active: true
        });
      }
      
      setSaving(false);
      navigate("/account/owner/products");
    } else if (id) {
      const { error: err } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);
      if (err) {
        setSaving(false);
        setError(err.message);
        return;
      }
      await supabase.from("product_categories").delete().eq("product_id", id);
      if (form.category_ids.length > 0) {
        await supabase.from("product_categories").insert(
          form.category_ids.map((cid, i) => ({
            product_id: id,
            category_id: cid,
            sort_order: i,
          })) as never,
        );
      }
      if (oldImageUrl && oldImageUrl !== form.image_url) {
        await deleteStorageFileIfOurs("products", oldImageUrl);
      }

      // Handle variants update
      const { data: existingVariants } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", id);
      
      const existingIds = existingVariants?.map(v => v.id) || [];
      const currentIds = form.variants.map(v => v.id).filter(Boolean) as string[];
      const toDelete = existingIds.filter(eId => !currentIds.includes(eId));
      
      if (toDelete.length > 0) {
        await supabase.from("product_variants").update({ is_active: false }).in("id", toDelete);
      }

      for (const v of form.variants) {
        const vPayload = {
          product_id: id,
          name: v.name,
          sku: v.sku || null,
          price: v.price ? parseFloat(v.price) : null,
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock_quantity: parseInt(v.stock_quantity, 10) || 0,
          is_default: v.is_default,
          image_url: v.image_url || null,
          is_active: true
        };
        
        if (v.id) {
          await supabase.from("product_variants").update(vPayload).eq("id", v.id);
        } else {
          await supabase.from("product_variants").insert(vPayload);
        }
      }

      setSaving(false);
      navigate("/account/owner/products");
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this product?")) return;
    setSaving(true);
    const product = (
      await supabase.from("products").select("image_url").eq("id", id).single()
    ).data as { image_url: string | null } | null;
    const { error: err } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (product?.image_url) {
      await deleteStorageFileIfOurs("products", product.image_url);
    }
    navigate("/account/owner/products");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-cream">
          {isNew ? "Add product" : "Edit product"}
        </h2>
        {!isNew && (
          <Button
            variant="secondary"
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-400 border border-red-900/50 hover:bg-red-955/20 hover:text-red-300"
          >
            Delete
          </Button>
        )}
      </div>
      {error && (
        <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="space-y-4 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
        <div>
          <label className="block text-sm font-medium text-white">
            Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Slug
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              className="flex-1 rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            <label className="flex items-center gap-1 text-sm text-brand-light">
              <input
                type="checkbox"
                checked={autoSlug}
                onChange={(e) => setAutoSlug(e.target.checked)}
                className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
              />
              Auto
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Product image
          </label>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {form.image_url ? (
                <div className="relative">
                  <img
                    src={form.image_url}
                    alt={form.name ? `${form.name} preview` : "Product image"}
                    width={128}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    className="h-32 w-32 rounded-lg border border-brand-medium/35 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-brand-medium/35 bg-brand-dark text-brand-light">
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-medium/35 bg-brand-dark-alt px-4 py-2 text-sm font-medium text-white hover:bg-brand-medium/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? "Uploading..." : "Upload from device"}
              </label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="Or paste image URL"
                className="w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Compare at price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compare_at_price}
              onChange={(e) =>
                setForm((f) => ({ ...f, compare_at_price: e.target.value }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white">
              SKU
            </label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock_quantity: e.target.value }))
              }
              className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-white">
              Low stock threshold (optional)
            </label>
            <input
              type="number"
              min="0"
              value={form.low_stock_threshold}
              onChange={(e) =>
                setForm((f) => ({ ...f, low_stock_threshold: e.target.value }))
              }
              placeholder="10"
              className="mt-1 w-full max-w-xs rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            <p className="mt-1 text-xs text-brand-light">
              Alert when stock falls below this. Leave empty for default (10).
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Categories
          </label>
          <p className="mt-1 text-xs text-brand-light">
            Select up to {MAX_CATEGORIES} categories. Used for filtering and
            suggested products.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {categories.map((c) => {
              const checked = form.category_ids.includes(c.id);
              const disabled =
                !checked && form.category_ids.length >= MAX_CATEGORIES;
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    disabled
                      ? "cursor-not-allowed border-brand-medium/10 bg-brand-medium/10 text-brand-light"
                      : "border-brand-medium/35 bg-brand-dark-alt text-white hover:bg-brand-medium/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((f) =>
                          f.category_ids.length < MAX_CATEGORIES
                            ? { ...f, category_ids: [...f.category_ids, c.id] }
                            : f,
                        );
                      } else {
                        setForm((f) => ({
                          ...f,
                          category_ids: f.category_ids.filter(
                            (x) => x !== c.id,
                          ),
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
              No categories yet. Create categories first.
            </p>
          )}
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_published: e.target.checked }))
              }
              className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-sm text-white">Published</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_featured: e.target.checked }))
              }
              className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
            />
            <span className="text-sm text-white">Featured</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-4 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Variants (Colors/Options)</h3>
            <p className="mt-1 text-xs text-brand-light">
              Add variants to track separate prices and inventory per option. If no variants exist, the product's base price and stock are used.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setForm(f => ({
                ...f,
                variants: [
                  ...f.variants, 
                  { name: "", sku: "", price: "", compare_at_price: "", stock_quantity: "0", is_default: f.variants.length === 0, image_url: "" }
                ]
              }))
            }}
          >
            Add variant
          </Button>
        </div>
        
        {form.variants.length > 0 && (
          <div className="space-y-4 mt-4">
            {form.variants.map((variant, index) => (
              <div key={variant.id || `new-${index}`} className="relative rounded-lg border border-brand-medium/60 bg-brand-dark p-4">
                <button
                  type="button"
                  onClick={() => {
                    setForm(f => {
                      const newVariants = [...f.variants];
                      newVariants.splice(index, 1);
                      if (variant.is_default && newVariants.length > 0) {
                        newVariants[0].is_default = true;
                      }
                      return { ...f, variants: newVariants };
                    });
                  }}
                  className="absolute top-4 right-4 text-brand-light hover:text-red-400"
                  title="Remove variant"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                <div className="grid gap-4 sm:grid-cols-2 mt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-white">Variant Name <span className="text-brand-orange">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Teak over Black"
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[index].name = e.target.value;
                        setForm({ ...form, variants: newVariants });
                      }}
                      className="mt-1 w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[index].sku = e.target.value;
                        setForm({ ...form, variants: newVariants });
                      }}
                      className="mt-1 w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Stock Quantity <span className="text-brand-orange">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={variant.stock_quantity}
                      onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[index].stock_quantity = e.target.value;
                        setForm({ ...form, variants: newVariants });
                      }}
                      className="mt-1 w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Override Price (optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[index].price = e.target.value;
                        setForm({ ...form, variants: newVariants });
                      }}
                      placeholder="Leave empty for base price"
                      className="mt-1 w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Override Compare At Price (optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.compare_at_price}
                      onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[index].compare_at_price = e.target.value;
                        setForm({ ...form, variants: newVariants });
                      }}
                      className="mt-1 w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-white">Override Image (optional)</label>
                    <div className="mt-1 flex items-center gap-3">
                      {variant.image_url && (
                        <div className="relative shrink-0">
                          <img src={variant.image_url} alt="Variant" className="h-12 w-12 rounded object-cover border border-brand-medium/35" />
                          <button
                            type="button"
                            onClick={() => {
                              const newVariants = [...form.variants];
                              newVariants[index].image_url = "";
                              setForm({ ...form, variants: newVariants });
                            }}
                            className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 p-0.5 text-white"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex-1 space-y-2 min-w-0">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-medium/35 bg-brand-dark-alt px-3 py-2 text-sm font-medium text-white hover:bg-brand-medium/30">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleVariantFileUpload(e, index)}
                            disabled={uploading}
                            className="hidden"
                          />
                          {uploading ? "Uploading..." : "Upload from device"}
                        </label>
                        <input
                          type="url"
                          value={variant.image_url}
                          onChange={(e) => {
                            const newVariants = [...form.variants];
                            newVariants[index].image_url = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }}
                          placeholder="Or paste image URL"
                          className="w-full rounded-lg bg-brand-dark-alt border border-brand-medium/60 text-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="default_variant"
                        checked={variant.is_default}
                        onChange={() => {
                          const newVariants = form.variants.map((v, i) => ({
                            ...v,
                            is_default: i === index
                          }));
                          setForm({ ...form, variants: newVariants });
                        }}
                        className="rounded-full border-brand-medium/60 bg-brand-dark-alt text-brand-orange focus:ring-brand-orange"
                      />
                      <span className="text-sm font-medium text-white">Default selection</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isNew ? "Create product" : "Save"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/account/owner/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

