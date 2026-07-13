import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CategoryRow } from '../types/database'

export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    setCategories((data ?? []) as CategoryRow[])
    setError(null)
  }

  useEffect(() => {
    void refetch()
  }, [])

  return { categories, loading, error, refetch }
}
