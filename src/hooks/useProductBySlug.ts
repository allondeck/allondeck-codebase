import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ProductRow } from '../types/database'

type ProductWithCategories = ProductRow & {
  product_categories?: { category_id: string }[]
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<ProductRow | null>(null)
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    void (async () => {
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select('*, product_categories(category_id)')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()
        if (err) throw err
        const p = data as ProductWithCategories
        setProduct(p)
        const ids = (p.product_categories ?? []).map((pc) => pc.category_id).filter(Boolean)
        setCategoryIds(ids)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  return { product, categoryIds, loading, error }
}
