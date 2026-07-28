import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { OrderConfirmationDetailsSection } from './partials/OrderConfirmationDetailsSection';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<{ total: number | string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchOrder() {
      if (!id) return;
      const { data } = await supabase
        .from('orders')
        .select('total, status')
        .eq('id', id)
        .single();
      setOrder(data as { total: number | string; status: string } | null);
      setLoading(false);
    }
    void fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!id || order?.status !== 'pending') return;
    const interval = setInterval(async () => {
      if (!id) return;
      const { data } = await supabase.from('orders').select('total, status').eq('id', id).single();
      setOrder(data as { total: number | string; status: string } | null);
    }, 3000);
    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  return <OrderConfirmationDetailsSection order={order} />;
}
