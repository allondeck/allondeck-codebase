import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { CouponRow } from '../types/database'

export function useCouponsAdmin() {
  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return
    }
    const raw = (data ?? []) as CouponRow[]
    const rows = raw.map((r) => ({
      ...r,
      scope_ids: Array.isArray(r.scope_ids) ? r.scope_ids : [],
    }))
    setCoupons(rows)
    setError(null)
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { coupons, loading, error, refetch }
}
