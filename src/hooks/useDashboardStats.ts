import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'

type OrderWithItems = {
  id: string
  status: string
  total: number
  created_at: string
  order_items: { product_name: string; product_id: string | null; quantity: number; product_price: number }[]
}

type ProductRow = {
  id: string
  name: string
  stock_quantity: number
  low_stock_threshold: number | null
}

const DEFAULT_LOW_STOCK_THRESHOLD = 10

const REVENUE_STATUSES = ['paid', 'processing', 'shipped', 'delivered']

export function useDashboardStats() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const [ordersRes, itemsRes, productsRes] = await Promise.all([
          supabase.from('orders').select('id, status, total, created_at').order('created_at', { ascending: false }),
          supabase.from('order_items').select('order_id, product_name, product_id, quantity, product_price'),
          supabase.from('products').select('id, name, stock_quantity, low_stock_threshold').eq('is_published', true),
        ])

        if (ordersRes.error) throw ordersRes.error
        if (itemsRes.error) throw itemsRes.error
        if (productsRes.error) throw productsRes.error

        const rawOrders = (ordersRes.data ?? []) as { id: string; status: string; total: number; created_at: string }[]
        const rawItems = (itemsRes.data ?? []) as {
          order_id: string
          product_name: string
          product_id: string | null
          quantity: number
          product_price: number
        }[]
        const itemsByOrder = rawItems.reduce<Record<string, typeof rawItems>>((acc, item) => {
          if (!acc[item.order_id]) acc[item.order_id] = []
          acc[item.order_id].push(item)
          return acc
        }, {})

        const ordersWithItems: OrderWithItems[] = rawOrders.map((o) => ({
          ...o,
          order_items: itemsByOrder[o.id] ?? [],
        }))

        setOrders(ordersWithItems)
        setProducts((productsRes.data ?? []) as ProductRow[])
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    const revenueOrders = orders.filter((o) => REVENUE_STATUSES.includes(o.status))
    const revenue = revenueOrders.reduce((sum, o) => sum + Number(o.total), 0)

    const ordersByStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, {})

    const topProducts = orders
      .filter((o) => REVENUE_STATUSES.includes(o.status))
      .flatMap((o) =>
        (o.order_items ?? []).map((item) => ({
          name: item.product_name,
          productId: item.product_id,
          quantity: item.quantity,
          revenue: item.quantity * Number(item.product_price),
        }))
      )
      .reduce<Record<string, { name: string; quantity: number; revenue: number }>>((acc, item) => {
        const key = item.productId ?? item.name
        if (!acc[key]) acc[key] = { name: item.name, quantity: 0, revenue: 0 }
        acc[key].quantity += item.quantity
        acc[key].revenue += item.revenue
        return acc
      }, {})
    const topProductsList = Object.values(topProducts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    const now = new Date()
    const days = 14
    const revenueByDay: { date: string; revenue: number; orders: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dateStr = d.toISOString().slice(0, 10)
      const dayOrders = orders.filter((o) => {
        const created = new Date(o.created_at)
        created.setHours(0, 0, 0, 0)
        return created.getTime() === d.getTime() && REVENUE_STATUSES.includes(o.status)
      })
      revenueByDay.push({
        date: dateStr,
        revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0),
        orders: dayOrders.length,
      })
    }

    const lowStockList = products.filter((p) => {
      const threshold = p.low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD
      return p.stock_quantity <= threshold
    })
    const lowStockProducts = lowStockList
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 5)
    const lowStockCount = lowStockList.length

    const ordersByDay: { date: string; orders: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dateStr = d.toISOString().slice(0, 10)
      const dayOrders = orders.filter((o) => {
        const created = new Date(o.created_at)
        created.setHours(0, 0, 0, 0)
        return created.getTime() === d.getTime()
      })
      ordersByDay.push({ date: dateStr, orders: dayOrders.length })
    }

    const averageOrderValueByDay = revenueByDay.map((row) => ({
      date: row.date,
      avg: row.orders > 0 ? Math.round((row.revenue / row.orders) * 100) / 100 : 0,
      orders: row.orders,
    }))

    const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const ordersByWeekday = WEEKDAY_NAMES.map((name, dayOfWeek) => {
      const count = orders.filter((o) => new Date(o.created_at).getDay() === dayOfWeek).length
      return { name, count, dayOfWeek }
    })

    return {
      revenue,
      totalOrders: orders.length,
      pendingOrders: ordersByStatus.pending ?? 0,
      ordersByStatus,
      topProducts: topProductsList,
      revenueByDay,
      ordersByDay,
      averageOrderValueByDay,
      ordersByWeekday,
      lowStockProducts,
      lowStockCount,
    }
  }, [orders, products])

  return { stats, loading, error }
}
