import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { parsePrice } from '../lib/utils'

export type DealStats = {
  totalRevenue: number
  orderCount: number
  unitsSold: number
}

export type DealOrderStatsMap = Record<string, DealStats>

export type DealTotals = {
  totalRevenue: number
  distinctOrdersWithDeal: number
  unitsSold: number
}

export function useDealOrderStats() {
  const [statsByDealId, setStatsByDealId] = useState<DealOrderStatsMap>({})
  const [totals, setTotals] = useState<DealTotals>({ totalRevenue: 0, distinctOrdersWithDeal: 0, unitsSold: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('order_items')
      .select('deal_id, order_id, product_price, quantity')
      .not('deal_id', 'is', null)

    setLoading(false)
    if (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return
    }

    const rows = (data ?? []) as {
      deal_id: string
      order_id: string
      product_price: number | string
      quantity: number
    }[]
    const map: DealOrderStatsMap = {}
    const orderIdsByDeal = new Map<string, Set<string>>()
    const allOrderIds = new Set<string>()
    for (const row of rows) {
      const id = row.deal_id
      if (!id) continue
      allOrderIds.add(row.order_id)
      const lineTotal = parsePrice(row.product_price) * row.quantity
      if (!map[id]) {
        map[id] = { totalRevenue: 0, orderCount: 0, unitsSold: 0 }
        orderIdsByDeal.set(id, new Set())
      }
      map[id].totalRevenue += lineTotal
      map[id].unitsSold += row.quantity
      orderIdsByDeal.get(id)!.add(row.order_id)
    }
    for (const [id, orderIds] of orderIdsByDeal) {
      if (map[id]) map[id].orderCount = orderIds.size
    }
    const totalRevenue = Object.values(map).reduce((s, m) => s + m.totalRevenue, 0)
    const unitsSold = Object.values(map).reduce((s, m) => s + m.unitsSold, 0)
    setStatsByDealId(map)
    setTotals({ totalRevenue, distinctOrdersWithDeal: allOrderIds.size, unitsSold })
    setError(null)
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { statsByDealId, totals, loading, error, refetch }
}
