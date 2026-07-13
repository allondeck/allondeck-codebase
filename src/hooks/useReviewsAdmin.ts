import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type ReviewAdminRow = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  body: string | null;
  hidden: boolean;
  created_at: string;
  reviewer_email: string | null;
  products: { name: string } | null;
};

export function useReviewsAdmin() {
  const [reviews, setReviews] = useState<ReviewAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("product_reviews")
      .select(
        "id, product_id, user_id, rating, body, hidden, created_at, reviewer_email, products(name)",
      )
      .order("created_at", { ascending: false });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setReviews((data ?? []) as ReviewAdminRow[]);
  }, []);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
}
