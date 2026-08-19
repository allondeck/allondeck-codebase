import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Upload, MoveUp, MoveDown } from "lucide-react";

export type GalleryImageItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  service_type: string;
  display_order: number;
  created_at: string;
};

const SERVICE_TYPE_OPTIONS = [
  { value: "custom_deck_designs", label: "Custom Deck Designs" },
  { value: "floor_manufacturing", label: "Floor Manufacturing" },
  { value: "cutting_installation", label: "Cutting & Installation" },
];

export default function OwnerGallery() {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    service_type: string;
    display_order: number;
  }>({
    title: "",
    description: "",
    image_url: "",
    service_type: "custom_deck_designs",
    display_order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      alert("Error fetching gallery images from database");
    } finally {
      setLoading(false);
    }
  }

  function openForm(item?: GalleryImageItem) {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description || "",
        image_url: item.image_url,
        service_type: item.service_type,
        display_order: item.display_order ?? 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        service_type: "custom_deck_designs",
        display_order: images.length + 1,
      });
    }
    setIsFormOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("store")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("store").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Gallery upload error:", err);
      alert("Failed to upload image to Supabase Storage");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please upload or provide an image URL");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim(),
        service_type: formData.service_type,
        display_order: Number(formData.display_order) || 0,
      };

      if (editingId) {
        const { error } = await supabase
          .from("gallery_images")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("gallery_images")
          .insert([payload]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchImages();
    } catch (err) {
      console.error("Error saving gallery item:", err);
      alert("Failed to save gallery item");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
      fetchImages();
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  }

  async function handleReorder(id: string, delta: number) {
    const itemIndex = images.findIndex((i) => i.id === id);
    if (itemIndex === -1) return;
    const targetIndex = itemIndex + delta;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const currentItem = images[itemIndex];
    const targetItem = images[targetIndex];

    try {
      await Promise.all([
        supabase
          .from("gallery_images")
          .update({ display_order: targetItem.display_order })
          .eq("id", currentItem.id),
        supabase
          .from("gallery_images")
          .update({ display_order: currentItem.display_order })
          .eq("id", targetItem.id),
      ]);
      fetchImages();
    } catch (err) {
      console.error("Error reordering:", err);
    }
  }

  const filteredImages = activeFilter === "all"
    ? images
    : images.filter((img) => img.service_type === activeFilter);

  const getServiceLabel = (type: string) => {
    const opt = SERVICE_TYPE_OPTIONS.find((o) => o.value === type);
    return opt ? opt.label : type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-cream font-heading">
            Gallery Management
          </h2>
          <p className="text-sm text-brand-light">
            Upload and organize project images attached to each service type.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-orange/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Gallery Image
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-brand-medium/35 pb-3">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeFilter === "all"
              ? "bg-brand-orange text-white"
              : "bg-brand-dark-alt text-brand-light hover:bg-brand-medium/30 hover:text-white"
          }`}
        >
          All ({images.length})
        </button>
        {SERVICE_TYPE_OPTIONS.map((opt) => {
          const count = images.filter((i) => i.service_type === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === opt.value
                  ? "bg-brand-orange text-white"
                  : "bg-brand-dark-alt text-brand-light hover:bg-brand-medium/30 hover:text-white"
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="rounded-xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl animate-in fade-in">
          <h3 className="mb-4 text-lg font-bold text-brand-cream font-heading border-b border-brand-medium/30 pb-3">
            {editingId ? "Edit Gallery Image" : "Upload New Gallery Image"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-light mb-1">
                  Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Custom Boat Decking Installation"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-brand-light mb-1">
                  Service Type *
                </label>
                <select
                  required
                  value={formData.service_type}
                  onChange={(e) =>
                    setFormData({ ...formData, service_type: e.target.value })
                  }
                  className="w-full rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  {SERVICE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-light mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Optional project summary or design details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-light mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-32 rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {/* Image Uploader */}
            <div>
              <label className="block text-xs font-semibold uppercase text-brand-light mb-1">
                Project Image *
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {formData.image_url ? (
                  <div className="relative group rounded-lg overflow-hidden border border-brand-medium/50">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-24 w-32 object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-brand-medium/50 bg-brand-dark text-brand-light">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-brand-orange/50 bg-brand-orange/20 px-4 py-2 text-xs font-semibold text-brand-orange hover:bg-brand-orange/30 transition-colors">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading to Supabase...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose File & Upload
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter image URL..."
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full sm:w-80 rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-brand-medium/30">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md border border-brand-medium/50 bg-brand-dark px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-orange/80 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Image"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List of Images */}
      <div className="overflow-x-auto rounded-xl border border-brand-medium/35 bg-brand-dark-alt shadow-md">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-brand-light">
            No gallery images available. Click "Add Gallery Image" to create one!
          </div>
        ) : (
          <table className="w-full min-w-[700px] divide-y divide-brand-medium/35 text-left text-sm">
            <thead className="bg-brand-medium/30 text-xs font-semibold uppercase text-brand-light">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Title & Description</th>
                <th className="px-4 py-3">Service Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-medium/35">
              {filteredImages.map((img, idx) => (
                <tr
                  key={img.id}
                  onClick={() => openForm(img)}
                  className="cursor-pointer hover:bg-brand-medium/20 transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-brand-light">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base min-w-[24px]">{img.display_order}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(img.id, -1);
                          }}
                          title="Move Up"
                          aria-label="Move image up"
                          className="rounded-md border border-brand-medium/50 bg-brand-dark p-2 text-brand-cream hover:border-brand-orange hover:bg-brand-orange hover:text-white disabled:opacity-20 transition-all shadow-sm"
                        >
                          <MoveUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={idx === filteredImages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(img.id, 1);
                          }}
                          title="Move Down"
                          aria-label="Move image down"
                          className="rounded-md border border-brand-medium/50 bg-brand-dark p-2 text-brand-cream hover:border-brand-orange hover:bg-brand-orange hover:text-white disabled:opacity-20 transition-all shadow-sm"
                        >
                          <MoveDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="h-14 w-20 rounded-md object-cover border border-brand-medium/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{img.title}</div>
                    {img.description && (
                      <div className="text-xs text-brand-light/70 line-clamp-1 max-w-md">
                        {img.description}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-brand-orange/15 border border-brand-orange/30 px-2.5 py-1 text-xs font-bold text-brand-orange uppercase">
                      {getServiceLabel(img.service_type)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openForm(img);
                        }}
                        className="text-brand-light hover:text-brand-orange transition-colors"
                        title="Edit image"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id);
                        }}
                        className="text-brand-light hover:text-red-400 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
