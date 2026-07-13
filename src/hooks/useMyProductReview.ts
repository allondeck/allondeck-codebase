import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type MyReviewRow = {
  id: string
  product_id: string
  user_id: string
  rating: number
  body: string | null
  created_at: string
}

async function fetchMyReview(
  productId: string,
  userId: string
): Promise<MyReviewRow | null> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('id, product_id, user_id, rating, body, created_at')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data as MyReviewRow
}

/**
 * Returns the current user's review for the given product, if any.
 * Used to hide the review form when the user has already reviewed.
 */
export function useMyProductReview(productId: string | null, userId: string | null) {
  const [review, setReview] = useState<MyReviewRow | null>(null)
  const [loading, setLoading] = useState(!!productId && !!userId)

  const refetch = useCallback(async () => {
    if (!productId || !userId) return
    setLoading(true)
    const data = await fetchMyReview(productId, userId)
    setReview(data)
    setLoading(false)
  }, [productId, userId])

  useEffect(() => {
    if (!productId || !userId) {
      setReview(null)
      setLoading(false)
      return
    }
    void refetch()
  }, [productId, userId, refetch])

  return { review, loading, refetch }
}
