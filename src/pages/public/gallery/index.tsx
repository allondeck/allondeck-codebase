import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { SEO } from "../../../components/ui/SEO";
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";

export type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  service_type: string;
  display_order: number;
  created_at: string;
};

const SERVICE_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "custom_deck_designs", label: "Custom Deck Designs" },
  { id: "floor_manufacturing", label: "Floor Manufacturing" },
  { id: "cutting_installation", label: "Cutting & Installation" },
];

const INITIAL_FALLBACK_IMAGES: GalleryImage[] = [
  {
    id: "f1",
    title: "Custom Marine Teak Pattern",
    description: "Custom CAD templating and precision EVA foam teak design for 32ft center console.",
    image_url: "/assets/images/1.jpg",
    service_type: "custom_deck_designs",
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "f2",
    title: "Hexagon Diamond Pattern",
    description: "Laser measured custom pattern with contrasting navy border accents.",
    image_url: "/assets/images/2.jpg",
    service_type: "custom_deck_designs",
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "f3",
    title: "CNC Foam Floor Fabrication",
    description: "Precision CNC router fabrication using dual layer closed-cell PE/EVA marine foam.",
    image_url: "/assets/images/3.jpg",
    service_type: "floor_manufacturing",
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "f4",
    title: "Non-Skid Helm Pad",
    description: "High-density helm station pad engineered for shock absorption and maximum traction.",
    image_url: "/assets/images/4.jpg",
    service_type: "floor_manufacturing",
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "f5",
    title: "Full Deck Installation",
    description: "Flawless professional surface prep and full vessel deck flooring installation.",
    image_url: "/assets/images/5.jpg",
    service_type: "cutting_installation",
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "f6",
    title: "Swim Platform & Transom Fit",
    description: "Custom fit installation around transom step and swim platform with bevel edge finish.",
    image_url: "/assets/images/10.jpg",
    service_type: "cutting_installation",
    display_order: 6,
    created_at: new Date().toISOString(),
  },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  async function fetchGalleryImages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery images:", error);
        setImages(INITIAL_FALLBACK_IMAGES);
      } else if (data && data.length > 0) {
        setImages(data);
      } else {
        setImages(INITIAL_FALLBACK_IMAGES);
      }
    } catch (err) {
      console.error("Gallery fetch failed:", err);
      setImages(INITIAL_FALLBACK_IMAGES);
    } finally {
      setLoading(false);
    }
  }

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter((img) => img.service_type === activeCategory);

  const currentImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  const handleNext = () => {
    if (selectedImageIndex !== null && filteredImages.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && filteredImages.length > 0) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + filteredImages.length) % filteredImages.length
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, filteredImages]);

  const getServiceLabel = (type: string) => {
    switch (type) {
      case "custom_deck_designs":
        return "Custom Deck Designs";
      case "floor_manufacturing":
        return "Floor Manufacturing";
      case "cutting_installation":
        return "Cutting & Installation";
      default:
        return type;
    }
  };

  return (
    <div className="bg-brand-dark text-white font-sans min-h-screen pb-24">
      <SEO
        title="Project Gallery & Marine Decking Portfolio | All On Deck"
        description="Browse our portfolio of custom boat decking, MarineMat EVA foam floor manufacturing, and precision installation projects across Florida."
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-brand-medium/35 bg-gradient-to-b from-brand-dark-alt to-brand-dark py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/15 border border-brand-orange/30 px-4 py-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4" />
            Our Portfolio & Work
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest text-brand-cream drop-shadow-md">
            PROJECT GALLERY
          </h1>
          <div className="mx-auto mt-4 h-1.5 w-24 bg-brand-orange rounded-full" />
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-brand-light">
            Explore our showcase of custom CAD deck designs, CNC foam floor manufacturing, and expert installation work crafted for boat owners across Florida.
          </p>
        </div>
      </section>

      {/* Main Gallery Area */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedImageIndex(null);
                }}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/25 ring-2 ring-brand-orange/50 scale-105"
                    : "bg-brand-dark-alt text-brand-light border border-brand-medium/40 hover:bg-brand-medium/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-medium/30 border-t-brand-orange" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="rounded-2xl border border-brand-medium/30 bg-brand-dark-alt py-16 text-center">
            <p className="text-brand-light text-lg">No gallery images found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-medium/30 bg-brand-dark-alt transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-orange/15 hover:border-brand-orange/60"
              >
                {/* Aspect Ratio Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-dark">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-brand-dark/80 backdrop-blur-md border border-brand-orange/40 px-3 py-1 text-[11px] font-bold text-brand-orange uppercase tracking-wider">
                      {getServiceLabel(img.service_type)}
                    </span>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-4 right-4 rounded-full bg-brand-orange p-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-brand-cream group-hover:text-brand-orange transition-colors">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="mt-2 text-xs sm:text-sm text-brand-light/80 line-clamp-2">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            aria-label="Close modal"
            className="absolute top-6 right-6 z-50 rounded-full bg-brand-dark/80 p-3 text-white hover:bg-brand-orange transition-colors border border-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Previous */}
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 top-1/2 z-50 -translate-y-1/2 rounded-full bg-brand-dark/80 p-3 text-white hover:bg-brand-orange transition-colors border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 top-1/2 z-50 -translate-y-1/2 rounded-full bg-brand-dark/80 p-3 text-white hover:bg-brand-orange transition-colors border border-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Content Box */}
          <div className="relative max-h-[90vh] max-w-5xl w-full flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-brand-medium/40 bg-brand-dark-alt shadow-2xl">
            <div className="relative flex max-h-[70vh] w-full items-center justify-center bg-black overflow-hidden">
              <img
                src={currentImage.image_url}
                alt={currentImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="w-full p-6 bg-brand-dark-alt border-t border-brand-medium/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3 py-0.5 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
                  {getServiceLabel(currentImage.service_type)}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-cream">
                  {currentImage.title}
                </h2>
                {currentImage.description && (
                  <p className="mt-1 text-sm text-brand-light max-w-3xl">
                    {currentImage.description}
                  </p>
                )}
              </div>
              <div className="text-xs text-brand-light/60 shrink-0">
                {selectedImageIndex + 1} of {filteredImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
