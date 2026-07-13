// Supabase Edge Function: Stripe webhook handler
// On checkout.session.completed, updates order to paid and stores session id

import Stripe from 'npm:stripe@^14.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!webhookSecret || !stripeSecretKey) {
    console.error('STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY not set')
    return new Response('Webhook not configured', { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 })
  }

  let body: string
  try {
    body = await req.text()
  } catch {
    return new Response('Invalid body', { status: 400 })
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20',
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id
    if (!orderId) {
      console.error('checkout.session.completed missing metadata.order_id')
      return new Response('OK', { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) {
      console.error('Failed to update order:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
})
