import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CategoryRow } from '../types/database'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data, error: err } = await supabase
          .from('categories')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
        if (err) throw err
        setCategories((data ?? []) as CategoryRow[])
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { categories, loading, error }
}
