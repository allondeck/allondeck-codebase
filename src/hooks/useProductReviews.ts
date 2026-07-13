import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const REVIEWS_PAGE_SIZE = 20

export type ProductReviewRow = {
  id: string
  product_id: string
  user_id: string
  rating: number
  body: string | null
  hidden: boolean
  created_at: string
}

export function useProductReviews(productId: string | null) {
  const [reviews, setReviews] = useState<ProductReviewRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (!productId) {
        if (!append) {
          setReviews([])
          setTotalCount(0)
          setLoading(false)
        }
        return
      }
      if (append) setLoadingMore(true)
      else setLoading(true)
      const from = offset
      const to = offset + REVIEWS_PAGE_SIZE - 1
      const { data, error: err, count } = await supabase
        .from('product_reviews')
        .select('id, product_id, user_id, rating, body, hidden, created_at', {
          count: 'exact',
        })
        .eq('product_id', productId)
        .eq('hidden', false)
        .order('created_at', { ascending: false })
        .range(from, to)
      if (append) setLoadingMore(false)
      else setLoading(false)
      if (err) {
        setError(err)
        return
      }
      const page = (data ?? []) as ProductReviewRow[]
      if (append) {
        setReviews((prev) => [...prev, ...page])
      } else {
        setReviews(page)
      }
      setTotalCount(count ?? 0)
    },
    [productId]
  )

  const fetchReviews = useCallback(() => fetchPage(0, false), [fetchPage])

  useEffect(() => {
    void fetchPage(0, false)
  }, [fetchPage])

  const loadMore = useCallback(() => {
    if (reviews.length >= totalCount || loadingMore) return
    void fetchPage(reviews.length, true)
  }, [reviews.length, totalCount, loadingMore, fetchPage])

  const hasMore = reviews.length < totalCount

  return {
    reviews,
    loading,
    loadingMore,
    error,
    refetch: fetchReviews,
    loadMore,
    hasMore,
    totalCount,
  }
}
