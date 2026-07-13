import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useOwnerExists() {
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.rpc('has_owner')
      if (error) {
        setExists(null)
        return
      }
      setExists(data === true)
    })()
  }, [])

  return exists
}
