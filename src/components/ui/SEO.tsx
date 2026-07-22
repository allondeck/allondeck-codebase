import { useEffect } from "react";

/**
 * SEO.tsx
 * 
 * Reusable SEO component for managing dynamic page titles, meta descriptions,
 * Open Graph (og:) tags for social sharing, and Twitter card tags.
 */

interface SEOProps {
  /** Page title (e.g. "Services | All On Deck") */
  title: string;
  /** Meta description summary for search engine results */
  description?: string;
  /** Image URL for social media share previews */
  image?: string;
  /** Canonical URL of the page */
  url?: string;
  /** Open Graph type (defaults to "website") */
  type?: string;
}

export function SEO({
  title,
  description = "All On Deck – Premium Marine Deck Flooring, Custom CAD Designs, CNC Manufacturing, and Precision Installation in Florida.",
  image = "/assets/images/1.jpg",
  url,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes("All On Deck") ? title : `${title} | All On Deck`;
    
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (attributeName: "name" | "property", attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Standard meta description
    setMetaTag("name", "description", description);

    // Open Graph meta tags
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    if (image) setMetaTag("property", "og:image", image);
    if (url) setMetaTag("property", "og:url", url);

    // Twitter Card meta tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    if (image) setMetaTag("name", "twitter:image", image);

  }, [title, description, image, url, type]);

  return null;
}
