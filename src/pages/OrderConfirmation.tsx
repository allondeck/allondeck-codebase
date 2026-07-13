import { Link, useParams } from 'react-router-dom'
import { formatPrice } from '../lib/utils'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<{ total: number | string; status: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    async function fetchOrder() {
      if (!id) return
      const { data } = await supabase
        .from('orders')
        .select('total, status')
        .eq('id', id)
        .single()
      setOrder(data as { total: number | string; status: string } | null)
      setLoading(false)
    }
    void fetchOrder()
  }, [id])

  useEffect(() => {
    if (!id || order?.status !== 'pending') return
    const interval = setInterval(async () => {
      if (!id) return
      const { data } = await supabase.from('orders').select('total, status').eq('id', id).single()
      setOrder(data as { total: number | string; status: string } | null)
    }, 3000)
    return () => clearInterval(interval)
  }, [id, order?.status])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    )
  }

  const isPaid = order?.status === 'paid'
  const isPending = order?.status === 'pending'

  return (
    <div className="mx-auto max-w-md rounded-xl border border-[#066175]/35 bg-[#052631] p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Order confirmed</h1>
      <p className="mt-2 text-[#f6ebd4]">
        Thank you for your order. {order && `Total: ${formatPrice(order.total)}`}
      </p>
      {isPaid && (
        <p className="mt-2 text-sm font-medium text-emerald-400">Payment received.</p>
      )}
      {isPending && (
        <p className="mt-2 text-sm text-[#76abbf]">
          Payment is processing. This page will update when payment is confirmed.
        </p>
      )}
      <Link
        to="/products"
        className="mt-6 inline-block rounded-lg bg-[#e38622] px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Continue shopping
      </Link>
      <Link
        to="/account"
        className="mt-4 block text-sm text-[#76abbf] hover:text-white"
      >
        View order history
      </Link>
    </div>
  )
}
