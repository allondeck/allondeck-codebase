import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useStoreSettings() {
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    void (async () => {
      const { data, error: err } = await supabase
        .from('store_settings')
        .select('key, value')
      if (err) {
        setError(err)
        setLoading(false)
        return
      }
      const map: Record<string, unknown> = {}
      for (const row of (data ?? []) as { key: string; value: unknown }[]) {
        map[row.key] = row.value
      }
      setSettings(map)
      setLoading(false)
    })()
  }, [])

  return { settings, loading, error }
}
