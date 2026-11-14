import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { ServiceRow } from "../types/database";

export const DEFAULT_SERVICES: ServiceRow[] = [
  {
    id: "default-1",
    title: "Custom DECK Designs",
    card_title: "Custom DECK Designs",
    description:
      "Each vessel is unique. Our CAD team designs custom marine deck templates tailored to your boat's specific layouts and configuration. We offer custom logo engraving, unique patterns, and stylized borders that fit your style perfectly.",
    secondary_description: null,
    image_url: "/assets/images/1.jpg",
    cta_text: "See More",
    cta_link: "/services#service-1",
    display_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "default-2",
    title: "Floor Manufacturing",
    card_title: "Floor Manufacturing",
    description:
      "We manufacture using MarineMat, the leading closed-cell EVA/PE foam material. Resilient to UV rays, salt water, and chemical stains, our materials provide superior non-skid traction even when wet, outstanding noise reduction, and excellent shock absorption.",
    secondary_description: null,
    image_url: "/assets/images/2.jpg",
    cta_text: "See More",
    cta_link: "/services#service-2",
    display_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "default-3",
    title: "Cutting and Installation",
    card_title: "Cutting and Installation",
    description:
      "With over two years of experience and outstanding results in Florida, we elevate your boat’s standard through high-precision CNC cutting. Our specialized team, using CAD and CAM software, ensures the millimeter-perfect fabrication of each MarineMat piece, followed by a professional and meticulous installation that guarantees a flawless fit, impeccable aesthetics, and maximum durability at sea.",
    secondary_description: null,
    image_url: "/assets/images/3.jpg",
    cta_text: "See More",
    cta_link: "/services#service-3",
    display_order: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
  },
];

// Module-level in-memory cache to prevent refetch delays and animation variant mismatches on navigation
let cachedServices: ServiceRow[] | null = null;
let activeFetchPromise: Promise<ServiceRow[] | null> | null = null;

export function useServices() {
  const [services, setServices] = useState<ServiceRow[]>(() => cachedServices ?? DEFAULT_SERVICES);
  const [loading, setLoading] = useState<boolean>(() => cachedServices === null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!activeFetchPromise) {
          activeFetchPromise = (async () => {
            const { data, error: err } = await supabase
              .from("services")
              .select("*")
              .eq("is_active", true)
              .order("display_order", { ascending: true })
              .order("created_at", { ascending: true });

            if (err) throw err;
            if (data && data.length > 0) {
              cachedServices = data;
              return data;
            }
            return null;
          })().finally(() => {
            activeFetchPromise = null;
          });
        }

        const data = await activeFetchPromise;
        if (isMounted) {
          if (data && data.length > 0) {
            setServices(data);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, loading, error };
}
