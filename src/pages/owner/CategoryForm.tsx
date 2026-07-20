import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { slugify } from "../../lib/utils";
import type { CategoryRow } from "../../types/database";

type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  sort_order: string;
  is_visible: boolean;
};

const initial: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  sort_order: "0",
  is_visible: true,
};

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<CategoryFormData>(initial);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (!isNew && id) {
      void (async () => {
        const { data, error: err } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        const c = data as CategoryRow;
        setForm({
          name: c.name,
          slug: c.slug,
          description: c.description ?? "",
          sort_order: String(c.sort_order),
          is_visible: c.is_visible,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      is_visible: form.is_visible,
    };
    if (isNew) {
      const { error: err } = await supabase.from("categories").insert(payload);
      setSaving(false);
      if (err) {
        setError(err.message);
        return;
      }
      navigate("/account/owner/categories");
    } else if (id) {
      const { error: err } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", id);
      setSaving(false);
      if (err) {
        setError(err.message);
        return;
      }
      navigate("/account/owner/categories");
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this category?")) return;
    setSaving(true);
    const { error: err } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/account/owner/categories");
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-cream">
          {isNew ? "Add category" : "Edit category"}
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
            Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Sort order
          </label>
          <input
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(e) =>
              setForm((f) => ({ ...f, sort_order: e.target.value }))
            }
            className="mt-1 w-full rounded-lg bg-brand-dark border border-brand-medium/60 text-white px-3 py-2 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_visible: e.target.checked }))
            }
            className="rounded border-brand-medium/60 bg-brand-dark text-brand-orange focus:ring-brand-orange"
          />
          <span className="text-sm text-white">Visible on storefront</span>
        </label>
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isNew ? "Create category" : "Save"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/account/owner/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

