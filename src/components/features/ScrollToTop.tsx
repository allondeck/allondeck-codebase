import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top synchronously before paint when the route changes,
 * preventing below-the-fold intersection triggers from firing prematurely.
 * Preserves anchor scroll if a hash is present (e.g. #service-1).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
