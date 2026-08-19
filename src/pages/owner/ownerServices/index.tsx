import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabase";
import { ServiceRow, GalleryImageRow } from "../../../types/database";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Image as ImageIcon,
  Upload,
  MoveUp,
  MoveDown,
  Layers,
  Images,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";

const SERVICE_TYPE_OPTIONS = [
  { value: "custom_deck_designs", label: "Custom Deck Designs" },
  { value: "floor_manufacturing", label: "Floor Manufacturing" },
  { value: "cutting_installation", label: "Cutting & Installation" },
];

export default function OwnerServices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "gallery" ? "gallery" : "services";
  const [activeTab, setActiveTab] = useState<"services" | "gallery">(initialTab);

  // Sync tab state when URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "gallery" || tabParam === "services") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "services" | "gallery") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // ==========================================
  // SERVICES STATE & HANDLERS
  // ==========================================
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState<{
    title: string;
    card_title: string;
    description: string;
    secondary_description: string;
    image_url: string;
    cta_text: string;
    cta_link: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: "",
    card_title: "",
    description: "",
    secondary_description: "",
    image_url: "",
    cta_text: "View Gallery",
    cta_link: "/gallery",
    display_order: 1,
    is_active: true,
  });

  const [savingService, setSavingService] = useState(false);
  const [uploadingServiceImg, setUploadingServiceImg] = useState(false);

  // ==========================================
  // GALLERY STATE & HANDLERS
  // ==========================================
  const [galleryImages, setGalleryImages] = useState<GalleryImageRow[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryActiveFilter, setGalleryActiveFilter] = useState<string>("all");
  const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryFormData, setGalleryFormData] = useState<{
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
    display_order: 1,
  });

  const [savingGallery, setSavingGallery] = useState(false);
  const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchServices();
    fetchGalleryImages();
  }, []);

  // ---------------- SERVICES API ----------------
  async function fetchServices() {
    setServicesLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Could not load services from Supabase (table might not exist yet):", error);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setServicesLoading(false);
    }
  }

  function openServiceForm(item?: ServiceRow) {
    if (item) {
      setEditingServiceId(item.id);
      setServiceFormData({
        title: item.title,
        card_title: item.card_title || "",
        description: item.description,
        secondary_description: item.secondary_description || "",
        image_url: item.image_url,
        cta_text: item.cta_text || "View Gallery",
        cta_link: item.cta_link || "/gallery",
        display_order: item.display_order ?? 1,
        is_active: item.is_active ?? true,
      });
    } else {
      setEditingServiceId(null);
      setServiceFormData({
        title: "",
        card_title: "",
        description: "",
        secondary_description: "",
        image_url: "",
        cta_text: "View Gallery",
        cta_link: "/gallery",
        display_order: services.length + 1,
        is_active: true,
      });
    }
    setIsServiceFormOpen(true);
  }

  async function handleServiceImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingServiceImg(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `service_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("store")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("store").getPublicUrl(filePath);

      setServiceFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Service image upload error:", err);
      alert("Failed to upload image to Supabase Storage");
    } finally {
      setUploadingServiceImg(false);
    }
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceFormData.image_url) {
      alert("Please upload or provide an image URL for the service");
      return;
    }

    setSavingService(true);
    try {
      const payload = {
        title: serviceFormData.title.trim(),
        card_title: serviceFormData.card_title.trim() || null,
        description: serviceFormData.description.trim(),
        secondary_description: serviceFormData.secondary_description.trim() || null,
        image_url: serviceFormData.image_url.trim(),
        cta_text: serviceFormData.cta_text.trim() || "View Gallery",
        cta_link: serviceFormData.cta_link.trim() || "/gallery",
        display_order: Number(serviceFormData.display_order) || 0,
        is_active: serviceFormData.is_active,
      };

      if (editingServiceId) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", editingServiceId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("services")
          .insert([payload]);
        if (error) throw error;
      }

      setIsServiceFormOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service. Please ensure the services table exists in Supabase.");
    } finally {
      setSavingService(false);
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm("Are you sure you want to delete this service section?")) return;
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service");
    }
  }

  async function handleToggleServiceActive(service: ServiceRow) {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);
      if (error) throw error;
      fetchServices();
    } catch (err) {
      console.error("Error toggling service status:", err);
    }
  }

  async function handleReorderService(id: string, delta: number) {
    const itemIndex = services.findIndex((i) => i.id === id);
    if (itemIndex === -1) return;
    const targetIndex = itemIndex + delta;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const currentItem = services[itemIndex];
    const targetItem = services[targetIndex];

    try {
      await Promise.all([
        supabase
          .from("services")
          .update({ display_order: targetItem.display_order })
          .eq("id", currentItem.id),
        supabase
          .from("services")
          .update({ display_order: currentItem.display_order })
          .eq("id", targetItem.id),
      ]);
      fetchServices();
    } catch (err) {
      console.error("Error reordering services:", err);
    }
  }

  // ---------------- GALLERY API ----------------
  async function fetchGalleryImages() {
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not fetch gallery images:", error);
      } else {
        setGalleryImages(data || []);
      }
    } catch (err) {
      console.error("Error fetching gallery images:", err);
    } finally {
      setGalleryLoading(false);
    }
  }

  function openGalleryForm(item?: GalleryImageRow) {
    if (item) {
      setEditingGalleryId(item.id);
      setGalleryFormData({
        title: item.title,
        description: item.description || "",
        image_url: item.image_url,
        service_type: item.service_type,
        display_order: item.display_order ?? 0,
      });
    } else {
      setEditingGalleryId(null);
      setGalleryFormData({
        title: "",
        description: "",
        image_url: "",
        service_type: "custom_deck_designs",
        display_order: galleryImages.length + 1,
      });
    }
    setIsGalleryFormOpen(true);
  }

  async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGalleryImg(true);
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

      setGalleryFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Gallery upload error:", err);
      alert("Failed to upload image to Supabase Storage");
    } finally {
      setUploadingGalleryImg(false);
    }
  }

  async function handleSaveGallery(e: React.FormEvent) {
    e.preventDefault();
    if (!galleryFormData.image_url) {
      alert("Please upload or provide an image URL");
      return;
    }

    setSavingGallery(true);
    try {
      const payload = {
        title: galleryFormData.title.trim(),
        description: galleryFormData.description.trim() || null,
        image_url: galleryFormData.image_url.trim(),
        service_type: galleryFormData.service_type,
        display_order: Number(galleryFormData.display_order) || 0,
      };

      if (editingGalleryId) {
        const { error } = await supabase
          .from("gallery_images")
          .update(payload)
          .eq("id", editingGalleryId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("gallery_images")
          .insert([payload]);
        if (error) throw error;
      }

      setIsGalleryFormOpen(false);
      fetchGalleryImages();
    } catch (err) {
      console.error("Error saving gallery item:", err);
      alert("Failed to save gallery item");
    } finally {
      setSavingGallery(false);
    }
  }

  async function handleDeleteGallery(id: string) {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
      fetchGalleryImages();
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  }

  async function handleReorderGallery(id: string, delta: number) {
    const itemIndex = galleryImages.findIndex((i) => i.id === id);
    if (itemIndex === -1) return;
    const targetIndex = itemIndex + delta;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const currentItem = galleryImages[itemIndex];
    const targetItem = galleryImages[targetIndex];

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
      fetchGalleryImages();
    } catch (err) {
      console.error("Error reordering gallery:", err);
    }
  }

  const filteredGalleryImages =
    galleryActiveFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.service_type === galleryActiveFilter);

  const getServiceLabel = (type: string) => {
    const opt = SERVICE_TYPE_OPTIONS.find((o) => o.value === type);
    return opt ? opt.label : type;
  };

  return (
    <div className="min-h-[80vh]">
      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED SERVICE EDITOR VIEW                                     */}
        {/* ========================================================================= */}
        {isServiceFormOpen ? (
          <motion.div
            key="service-editor-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Navigation & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-medium/35 pb-5">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsServiceFormOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange hover:text-brand-cream transition-colors group mb-1"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Services List</span>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream font-heading">
                  {editingServiceId ? "Edit Service Offering" : "Add New Service Offering"}
                </h1>
                <p className="text-xs sm:text-sm text-brand-light">
                  {editingServiceId
                    ? `Editing "${serviceFormData.title || "Custom Service"}" section`
                    : "Create a new service section for the public Services page"}
                </p>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsServiceFormOpen(false)}
                  className="rounded-lg border border-brand-medium/50 bg-brand-dark px-4 py-2 text-xs sm:text-sm font-semibold text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveService}
                  disabled={savingService || uploadingServiceImg}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-brand-orange/80 disabled:opacity-50 transition-all shadow-brand-orange/20"
                >
                  {savingService && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Check className="h-4 w-4" />
                  <span>{savingService ? "Saving..." : "Save Service"}</span>
                </button>
              </div>
            </div>

            {/* Main Form Body */}
            <form onSubmit={handleSaveService} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Content and CTA settings (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Card 1: Text & Content */}
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-medium/30 pb-3">
                      <Layers className="h-4 w-4 text-brand-orange" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cream font-heading">
                        Section Content
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Main Section Title <span className="text-brand-orange">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Custom DECK Designs"
                          value={serviceFormData.title}
                          onChange={(e) =>
                            setServiceFormData({ ...serviceFormData, title: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Hero Card Title <span className="text-xs text-brand-light/60 font-normal lowercase">(optional, use \n for line break)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Custom \n Deck Designs"
                          value={serviceFormData.card_title}
                          onChange={(e) =>
                            setServiceFormData({ ...serviceFormData, card_title: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Primary Description <span className="text-brand-orange">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Comprehensive explanation of what this marine service includes, material advantages, CAD templating..."
                          value={serviceFormData.description}
                          onChange={(e) =>
                            setServiceFormData({ ...serviceFormData, description: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Secondary / Supporting Description <span className="text-xs text-brand-light/60 font-normal lowercase">(optional)</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Additional technical details, warranty notes, or supporting paragraphs..."
                          value={serviceFormData.secondary_description}
                          onChange={(e) =>
                            setServiceFormData({
                              ...serviceFormData,
                              secondary_description: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: CTA Button & Placement Settings */}
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-medium/30 pb-3">
                      <Sparkles className="h-4 w-4 text-brand-orange" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cream font-heading">
                        Call-To-Action & Visibility
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Button Text
                        </label>
                        <input
                          type="text"
                          placeholder="View Gallery"
                          value={serviceFormData.cta_text}
                          onChange={(e) =>
                            setServiceFormData({ ...serviceFormData, cta_text: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={serviceFormData.display_order}
                          onChange={(e) =>
                            setServiceFormData({
                              ...serviceFormData,
                              display_order: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Button Destination Link
                        </label>
                        <input
                          type="text"
                          placeholder="/gallery?category=custom_deck_designs"
                          value={serviceFormData.cta_link}
                          onChange={(e) =>
                            setServiceFormData({ ...serviceFormData, cta_link: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                        <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] text-brand-light/70 mr-1">Quick presets:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceFormData({
                                ...serviceFormData,
                                cta_link: "/gallery?category=custom_deck_designs",
                              })
                            }
                            className="rounded-full bg-brand-dark border border-brand-medium/60 px-2.5 py-0.5 text-[11px] text-brand-cream hover:border-brand-orange hover:text-brand-orange transition-colors"
                          >
                            Custom Designs Gallery
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceFormData({
                                ...serviceFormData,
                                cta_link: "/gallery?category=floor_manufacturing",
                              })
                            }
                            className="rounded-full bg-brand-dark border border-brand-medium/60 px-2.5 py-0.5 text-[11px] text-brand-cream hover:border-brand-orange hover:text-brand-orange transition-colors"
                          >
                            Manufacturing Gallery
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceFormData({
                                ...serviceFormData,
                                cta_link: "/gallery?category=cutting_installation",
                              })
                            }
                            className="rounded-full bg-brand-dark border border-brand-medium/60 px-2.5 py-0.5 text-[11px] text-brand-cream hover:border-brand-orange hover:text-brand-orange transition-colors"
                          >
                            Installation Gallery
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceFormData({
                                ...serviceFormData,
                                cta_link: "/estimate",
                              })
                            }
                            className="rounded-full bg-brand-dark border border-brand-medium/60 px-2.5 py-0.5 text-[11px] text-brand-cream hover:border-brand-orange hover:text-brand-orange transition-colors"
                          >
                            Estimate Page
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center gap-3 pt-3 border-t border-brand-medium/30">
                      <input
                        type="checkbox"
                        id="service_is_active"
                        checked={serviceFormData.is_active}
                        onChange={(e) =>
                          setServiceFormData({ ...serviceFormData, is_active: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-brand-medium/50 bg-brand-dark text-brand-orange focus:ring-brand-orange"
                      />
                      <label htmlFor="service_is_active" className="text-sm font-medium text-white cursor-pointer select-none">
                        Active & Published (Visible on public Services page)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column: Featured Image & Live Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Image Upload Card */}
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-medium/30 pb-3">
                      <ImageIcon className="h-4 w-4 text-brand-orange" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cream font-heading">
                        Featured Image
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {serviceFormData.image_url ? (
                        <div className="relative group rounded-xl overflow-hidden border border-brand-medium/50 aspect-[16/10] bg-brand-dark">
                          <img
                            src={serviceFormData.image_url}
                            alt="Service Preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-brand-dark/90 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-orange transition-colors">
                              <Upload className="h-3.5 w-3.5" />
                              Replace Image
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleServiceImageUpload}
                                disabled={uploadingServiceImg}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-medium/50 bg-brand-dark/50 py-10 px-4 text-center">
                          <ImageIcon className="h-10 w-10 text-brand-light/50 mb-2" />
                          <p className="text-xs font-medium text-brand-light">No image chosen yet</p>
                          <p className="text-[11px] text-brand-light/60 mt-0.5">Upload a high quality photo or enter URL</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-orange/50 bg-brand-orange/20 px-4 py-2.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange/30 transition-colors w-full">
                          {uploadingServiceImg ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading to Storage...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image File
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleServiceImageUpload}
                            disabled={uploadingServiceImg}
                          />
                        </label>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-brand-light/80 mb-1">
                            Or Enter Direct Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /assets/images/1.jpg or https://..."
                            value={serviceFormData.image_url}
                            onChange={(e) =>
                              setServiceFormData({ ...serviceFormData, image_url: e.target.value })
                            }
                            className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-xs text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview Card */}
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-brand-medium/30 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                        Live Preview
                      </span>
                      <span className="text-[11px] text-brand-light/70">
                        {serviceFormData.is_active ? "Published" : "Hidden"}
                      </span>
                    </div>

                    <div className="rounded-xl border border-brand-medium/40 bg-brand-dark p-4 space-y-3">
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-brand-medium/20">
                        {serviceFormData.image_url ? (
                          <img
                            src={serviceFormData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-light/40">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-heading text-base font-bold text-brand-cream truncate">
                        {serviceFormData.title || "Service Title Preview"}
                      </h3>
                      <p className="text-xs text-brand-light line-clamp-2 leading-relaxed">
                        {serviceFormData.description || "Service description will appear here..."}
                      </p>
                      <div className="pt-1">
                        <span className="inline-block rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white shadow-md">
                          {serviceFormData.cta_text || "View Gallery"} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-medium/35">
                <button
                  type="button"
                  onClick={() => setIsServiceFormOpen(false)}
                  className="rounded-lg border border-brand-medium/50 bg-brand-dark px-5 py-2.5 text-sm font-semibold text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingService || uploadingServiceImg}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-orange/80 disabled:opacity-50 transition-all shadow-brand-orange/25"
                >
                  {savingService && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Check className="h-4 w-4" />
                  <span>{savingService ? "Saving Changes..." : "Save Service Section"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : isGalleryFormOpen ? (
          /* ========================================================================= */
          /* VIEW 2: DEDICATED GALLERY PROJECT EDITOR VIEW                             */
          /* ========================================================================= */
          <motion.div
            key="gallery-editor-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Navigation & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-medium/35 pb-5">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsGalleryFormOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange hover:text-brand-cream transition-colors group mb-1"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Gallery Projects</span>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream font-heading">
                  {editingGalleryId ? "Edit Gallery Project" : "Upload New Gallery Image"}
                </h1>
                <p className="text-xs sm:text-sm text-brand-light">
                  {editingGalleryId
                    ? `Editing "${galleryFormData.title || "Gallery Item"}" project`
                    : "Add a photo to showcase custom marine decking in the portfolio"}
                </p>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsGalleryFormOpen(false)}
                  className="rounded-lg border border-brand-medium/50 bg-brand-dark px-4 py-2 text-xs sm:text-sm font-semibold text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGallery}
                  disabled={savingGallery || uploadingGalleryImg}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-brand-orange/80 disabled:opacity-50 transition-all shadow-brand-orange/20"
                >
                  {savingGallery && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Check className="h-4 w-4" />
                  <span>{savingGallery ? "Saving..." : "Save Image"}</span>
                </button>
              </div>
            </div>

            {/* Main Form Body */}
            <form onSubmit={handleSaveGallery} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form Details (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-medium/30 pb-3">
                      <Images className="h-4 w-4 text-brand-orange" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cream font-heading">
                        Project Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Project Title <span className="text-brand-orange">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Custom Marine Teak Pattern"
                          value={galleryFormData.title}
                          onChange={(e) =>
                            setGalleryFormData({ ...galleryFormData, title: e.target.value })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                            Service Category <span className="text-brand-orange">*</span>
                          </label>
                          <select
                            required
                            value={galleryFormData.service_type}
                            onChange={(e) =>
                              setGalleryFormData({
                                ...galleryFormData,
                                service_type: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                          >
                            {SERVICE_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={galleryFormData.display_order}
                            onChange={(e) =>
                              setGalleryFormData({
                                ...galleryFormData,
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-light mb-1.5">
                          Description <span className="text-xs text-brand-light/60 font-normal lowercase">(optional)</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Short summary of the vessel, material used, or CAD design highlights..."
                          value={galleryFormData.description}
                          onChange={(e) =>
                            setGalleryFormData({
                              ...galleryFormData,
                              description: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3.5 py-2.5 text-sm text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Image Upload & Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-brand-medium/40 bg-brand-dark-alt p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-medium/30 pb-3">
                      <ImageIcon className="h-4 w-4 text-brand-orange" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cream font-heading">
                        Project Image
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {galleryFormData.image_url ? (
                        <div className="relative group rounded-xl overflow-hidden border border-brand-medium/50 aspect-[4/3] bg-brand-dark">
                          <img
                            src={galleryFormData.image_url}
                            alt="Gallery Preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-brand-dark/90 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-orange transition-colors">
                              <Upload className="h-3.5 w-3.5" />
                              Replace Image
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleGalleryImageUpload}
                                disabled={uploadingGalleryImg}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-medium/50 bg-brand-dark/50 py-10 px-4 text-center aspect-[4/3]">
                          <ImageIcon className="h-10 w-10 text-brand-light/50 mb-2" />
                          <p className="text-xs font-medium text-brand-light">No image chosen</p>
                          <p className="text-[11px] text-brand-light/60 mt-0.5">Upload a project photo</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-orange/50 bg-brand-orange/20 px-4 py-2.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange/30 transition-colors w-full">
                          {uploadingGalleryImg ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading to Storage...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image File
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleGalleryImageUpload}
                            disabled={uploadingGalleryImg}
                          />
                        </label>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-brand-light/80 mb-1">
                            Or Enter Direct Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /assets/images/1.jpg or https://..."
                            value={galleryFormData.image_url}
                            onChange={(e) =>
                              setGalleryFormData({ ...galleryFormData, image_url: e.target.value })
                            }
                            className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-xs text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-medium/35">
                <button
                  type="button"
                  onClick={() => setIsGalleryFormOpen(false)}
                  className="rounded-lg border border-brand-medium/50 bg-brand-dark px-5 py-2.5 text-sm font-semibold text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGallery || uploadingGalleryImg}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-orange/80 disabled:opacity-50 transition-all shadow-brand-orange/25"
                >
                  {savingGallery && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Check className="h-4 w-4" />
                  <span>{savingGallery ? "Saving Changes..." : "Save Gallery Image"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW 3: MAIN DASHBOARD LIST VIEW (TABS + TABLES)                          */
          /* ========================================================================= */
          <motion.div
            key="main-list-view"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Top Header & Public Page Link */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-medium/35 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream font-heading">
                  Services & Gallery
                </h1>
                <p className="text-sm text-brand-light mt-1">
                  Manage your service offerings, custom section descriptions, and project gallery images.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-medium/60 bg-brand-dark px-3.5 py-2 text-xs font-semibold text-brand-light hover:text-brand-cream hover:bg-brand-medium/30 transition-all shadow-sm"
                >
                  <span>View Services Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="/gallery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-medium/60 bg-brand-dark px-3.5 py-2 text-xs font-semibold text-brand-light hover:text-brand-cream hover:bg-brand-medium/30 transition-all shadow-sm"
                >
                  <span>View Gallery</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex gap-4 border-b border-brand-medium/35 pb-1">
              <button
                onClick={() => handleTabChange("services")}
                className={`flex items-center gap-2 pb-3 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                  activeTab === "services"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-brand-light hover:text-brand-cream"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Services Sections ({services.length})</span>
              </button>

              <button
                onClick={() => handleTabChange("gallery")}
                className={`flex items-center gap-2 pb-3 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                  activeTab === "gallery"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-brand-light hover:text-brand-cream"
                }`}
              >
                <Images className="h-4 w-4" />
                <span>Gallery Projects ({galleryImages.length})</span>
              </button>
            </div>

            {/* TAB 1: SERVICES MANAGEMENT */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-brand-cream font-heading">
                      Active Service Offerings
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-light">
                      Click any service row to edit. Each service is rendered on the public Services page in alternating dark & medium themed sections.
                    </p>
                  </div>
                  <button
                    onClick={() => openServiceForm()}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-orange/80 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </button>
                </div>

                {/* Services Table List */}
                <div className="overflow-x-auto rounded-xl border border-brand-medium/35 bg-brand-dark-alt shadow-md">
                  {servicesLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-brand-light">
                      <p>No custom services currently in database.</p>
                      <p className="mt-1 text-xs text-brand-light/70">
                        Click "Add Service" to create your first customizable service section.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[750px] divide-y divide-brand-medium/35 text-left text-sm">
                      <thead className="bg-brand-medium/30 text-xs font-semibold uppercase text-brand-light">
                        <tr>
                          <th className="px-4 py-3">Order</th>
                          <th className="px-4 py-3">Image</th>
                          <th className="px-4 py-3">Title & Summary</th>
                          <th className="px-4 py-3">CTA Button</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-medium/35">
                        {services.map((srv, idx) => (
                          <tr
                            key={srv.id}
                            onClick={() => openServiceForm(srv)}
                            className="cursor-pointer hover:bg-brand-medium/20 transition-colors"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-brand-light">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-base min-w-[24px]">
                                  {srv.display_order}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    disabled={idx === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReorderService(srv.id, -1);
                                    }}
                                    title="Move Up"
                                    aria-label="Move service up"
                                    className="rounded-md border border-brand-medium/50 bg-brand-dark p-1.5 text-brand-cream hover:border-brand-orange hover:bg-brand-orange hover:text-white disabled:opacity-20 transition-all shadow-sm"
                                  >
                                    <MoveUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === services.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReorderService(srv.id, 1);
                                    }}
                                    title="Move Down"
                                    aria-label="Move service down"
                                    className="rounded-md border border-brand-medium/50 bg-brand-dark p-1.5 text-brand-cream hover:border-brand-orange hover:bg-brand-orange hover:text-white disabled:opacity-20 transition-all shadow-sm"
                                  >
                                    <MoveDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <img
                                src={srv.image_url}
                                alt={srv.title}
                                className="h-14 w-20 rounded-md object-cover border border-brand-medium/50"
                              />
                            </td>
                            <td className="px-4 py-3 max-w-sm">
                              <div className="font-bold text-brand-cream">{srv.title}</div>
                              <p className="text-xs text-brand-light/80 line-clamp-2 mt-0.5">
                                {srv.description}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <span className="inline-block rounded-md bg-brand-medium/40 border border-brand-medium/50 px-2 py-1 text-xs text-brand-light">
                                {srv.cta_text || "View Gallery"} → {srv.cta_link || "/gallery"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleServiceActive(srv);
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                                  srv.is_active
                                    ? "bg-green-500/15 border border-green-500/30 text-green-400"
                                    : "bg-red-500/15 border border-red-500/30 text-red-400"
                                }`}
                              >
                                {srv.is_active ? (
                                  <>
                                    <Eye className="h-3.5 w-3.5" /> Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3.5 w-3.5" /> Hidden
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openServiceForm(srv);
                                  }}
                                  className="text-brand-light hover:text-brand-orange transition-colors"
                                  title="Edit service"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteService(srv.id);
                                  }}
                                  className="text-brand-light hover:text-red-400 transition-colors"
                                  title="Delete service"
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
            )}

            {/* TAB 2: GALLERY MANAGEMENT */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-brand-cream font-heading">
                      Gallery Project Images
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-light">
                      Click any photo row to edit. Categorize custom boat decking and manufacturing photos for the project gallery.
                    </p>
                  </div>
                  <button
                    onClick={() => openGalleryForm()}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-orange/80 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Gallery Image
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-brand-medium/35 pb-3">
                  <button
                    onClick={() => setGalleryActiveFilter("all")}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      galleryActiveFilter === "all"
                        ? "bg-brand-orange text-white"
                        : "bg-brand-dark-alt text-brand-light hover:bg-brand-medium/30 hover:text-white"
                    }`}
                  >
                    All ({galleryImages.length})
                  </button>
                  {SERVICE_TYPE_OPTIONS.map((opt) => {
                    const count = galleryImages.filter((i) => i.service_type === opt.value).length;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setGalleryActiveFilter(opt.value)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          galleryActiveFilter === opt.value
                            ? "bg-brand-orange text-white"
                            : "bg-brand-dark-alt text-brand-light hover:bg-brand-medium/30 hover:text-white"
                        }`}
                      >
                        {opt.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Table List of Images */}
                <div className="overflow-x-auto rounded-xl border border-brand-medium/35 bg-brand-dark-alt shadow-md">
                  {galleryLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
                    </div>
                  ) : filteredGalleryImages.length === 0 ? (
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
                        {filteredGalleryImages.map((img, idx) => (
                          <tr
                            key={img.id}
                            onClick={() => openGalleryForm(img)}
                            className="cursor-pointer hover:bg-brand-medium/20 transition-colors"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-brand-light">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-base min-w-[24px]">
                                  {img.display_order}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    disabled={idx === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReorderGallery(img.id, -1);
                                    }}
                                    title="Move Up"
                                    aria-label="Move image up"
                                    className="rounded-md border border-brand-medium/50 bg-brand-dark p-2 text-brand-cream hover:border-brand-orange hover:bg-brand-orange hover:text-white disabled:opacity-20 transition-all shadow-sm"
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    disabled={idx === filteredGalleryImages.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReorderGallery(img.id, 1);
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
                                    openGalleryForm(img);
                                  }}
                                  className="text-brand-light hover:text-brand-orange transition-colors"
                                  title="Edit image"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGallery(img.id);
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
