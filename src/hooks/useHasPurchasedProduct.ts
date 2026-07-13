import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Returns whether the current user has purchased the given product (has an order containing it).
 * Used to show/hide the review form on the product page.
 */
export function useHasPurchasedProduct(
  productId: string | null,
  userId: string | null,
) {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(!!productId && !!userId);

  useEffect(() => {
    if (!productId || !userId) {
      setHasPurchased(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase.rpc("has_purchased_product", {
        p_product_id: productId,
      });
      if (cancelled) return;
      setLoading(false);
      if (error) {
        setHasPurchased(false);
        return;
      }
      setHasPurchased(data === true);
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, userId]);

  return { hasPurchased, loading };
}
