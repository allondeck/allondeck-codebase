import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export type CouponStats = {
  totalSaved: number
  totalSpent: number
  orderCount: number
}

export type CouponOrderStatsMap = Record<string, CouponStats>

export function useCouponOrderStats() {
  const [statsByCouponId, setStatsByCouponId] = useState<CouponOrderStatsMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('orders')
      .select('coupon_id, discount_amount, total')
      .not('coupon_id', 'is', null)

    setLoading(false)
    if (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return
    }

    const rows = (data ?? []) as { coupon_id: string; discount_amount: number | string; total: number | string }[]
    const map: CouponOrderStatsMap = {}
    for (const row of rows) {
      const id = row.coupon_id
      if (!id) continue
      const saved = Number(row.discount_amount) || 0
      const spent = Number(row.total) || 0
      if (!map[id]) {
        map[id] = { totalSaved: 0, totalSpent: 0, orderCount: 0 }
      }
      map[id].totalSaved += saved
      map[id].totalSpent += spent
      map[id].orderCount += 1
    }
    setStatsByCouponId(map)
    setError(null)
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { statsByCouponId, loading, error, refetch }
}
