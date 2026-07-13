import { supabase } from './supabase'

type OrderRow = {
  id: string
  customer_email: string | null
  guest_email: string | null
  status: string
  total: number | string
  created_at: string
}

type OrderItemRow = {
  order_id: string
  product_name: string
  quantity: number
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export async function exportOrdersToCsv(orders: OrderRow[]): Promise<void> {
  if (orders.length === 0) {
    return
  }
  const orderIds = orders.map((o) => o.id)
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('order_id, product_name, quantity')
    .in('order_id', orderIds)
  const items = (itemsData ?? []) as OrderItemRow[]
  const itemsByOrder = items.reduce<Record<string, OrderItemRow[]>>((acc, item) => {
    if (!acc[item.order_id]) acc[item.order_id] = []
    acc[item.order_id].push(item)
    return acc
  }, {})

  const headers = ['Order ID', 'Date', 'Status', 'Total', 'Customer email', 'Items']
  const rows = orders.map((o) => {
    const orderItems = itemsByOrder[o.id] ?? []
    const itemsStr = orderItems.map((i) => `${i.product_name} × ${i.quantity}`).join('; ')
    return [
      o.id,
      new Date(o.created_at).toISOString().slice(0, 10),
      o.status,
      String(o.total),
      (o.customer_email ?? o.guest_email ?? '').trim() || '—',
      itemsStr,
    ]
  })
  const csv = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
