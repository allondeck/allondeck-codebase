import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  console.error(
    `Supabase env vars missing: ${missing.join(', ')}. Set them in .env (local) or in your host's env (e.g. Vercel). Use the exact names; redeploy after changing.`
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
