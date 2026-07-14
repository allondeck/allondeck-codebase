import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ProductRow } from '../types/database'
import type { CategoryRow } from '../types/database'

export type ProductWithCategories = ProductRow & {
  product_categories?: { categories: CategoryRow | null }[];
  product_variants?: { stock_quantity: number; is_active: boolean }[];
}

export type ProductSortBy = 'newest' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'

const DEFAULT_LOW_STOCK_THRESHOLD = 10

export function useProductsAdmin(options?: {
  categoryId?: string
  featured?: boolean
  sortBy?: ProductSortBy
  lowStockOnly?: boolean
}) {
  const [products, setProducts] = useState<ProductWithCategories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      const selectFields = options?.categoryId
        ? '*, product_categories!inner(categories(id, name, slug)), product_variants(stock_quantity, is_active)'
        : '*, product_categories(categories(id, name, slug)), product_variants(stock_quantity, is_active)'
      const sortBy = options?.sortBy ?? 'newest'
      const sortByStock = sortBy === 'stock_asc' || sortBy === 'stock_desc'

      let query = supabase.from('products').select(selectFields)

      if (sortByStock) {
        query = query.order('stock_quantity', { ascending: sortBy === 'stock_asc' })
      } else {
        query = query.order('is_featured', { ascending: false })
        if (sortBy === 'price_asc') query = query.order('price', { ascending: true })
        else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
        else query = query.order('created_at', { ascending: false })
      }

      if (options?.categoryId) {
        query = query.eq('product_categories.category_id', options.categoryId)
      }

      if (options?.featured === true) {
        query = query.eq('is_featured', true)
      }

      const { data, error: err } = await query
      setLoading(false)
      if (err) {
        setError(err)
        return
      }
      let raw = (data ?? []) as ProductWithCategories[]
      if (options?.lowStockOnly) {
        raw = raw.filter((p) => {
          const threshold = (p as ProductWithCategories & { low_stock_threshold?: number | null }).low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD
          const activeVariants = p.product_variants?.filter(v => v.is_active) || []
          
          if (activeVariants.length > 0) {
            return activeVariants.some(v => v.stock_quantity <= threshold)
          }
          return p.stock_quantity <= threshold
        })
      }
      // Admin list: preserve DB order (e.g. stock low→high); do not reorder by featured
      setProducts(raw)
      setError(null)
    })()
  }, [options?.categoryId, options?.featured, options?.sortBy, options?.lowStockOnly])

  return { products, loading, error }
}
