import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_price: number | string
  quantity: number
  variant_id?: string | null
  variant_name?: string | null
}

export type OrderDetailRow = {
  id: string
  user_id: string | null
  guest_email: string | null
  customer_email: string | null
  status: string
  total: number | string
  subtotal: number | string
  shipping_total: number | string
  tax_total: number | string
  discount_amount?: number | string
  coupon_id: string | null
  shipping_address: unknown
  billing_address: unknown
  created_at: string
  stripe_checkout_session_id?: string | null
  coupons?: { code: string } | null
  tracking_number?: string | null
  carrier?: string | null
  stock_restored_at?: string | null
  stock_reserved_at?: string | null
}

export function useOrderDetail(orderId: string | undefined) {
  const [order, setOrder] = useState<OrderDetailRow | null>(null)
  const [items, setItems] = useState<OrderItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!orderId) return
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('*, coupons(code)')
      .eq('id', orderId)
      .single()
    if (!orderErr) setOrder(orderData as OrderDetailRow)
    const { data: itemsData, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    if (!itemsErr) setItems((itemsData ?? []) as OrderItemRow[])
  }, [orderId])

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    void (async () => {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*, coupons(code)')
        .eq('id', orderId)
        .single()
      if (orderErr) {
        setError(orderErr)
        setLoading(false)
        return
      }
      setOrder(orderData as OrderDetailRow)
      const { data: itemsData, error: itemsErr } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
      if (itemsErr) {
        setError(itemsErr)
      } else {
        setItems((itemsData ?? []) as OrderItemRow[])
      }
      setLoading(false)
    })()
  }, [orderId])

  return { order, items, loading, error, refetch }
}
