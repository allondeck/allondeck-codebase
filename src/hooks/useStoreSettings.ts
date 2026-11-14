import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

let cachedSettings: Record<string, unknown> | null = null;
let settingsPromise: Promise<Record<string, unknown> | null> | null = null;

export function useStoreSettings() {
  const [settings, setSettings] = useState<Record<string, unknown>>(() => cachedSettings ?? {})
  const [loading, setLoading] = useState(() => cachedSettings === null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true;
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!settingsPromise) {
      settingsPromise = (async () => {
        const { data, error: err } = await supabase
          .from('store_settings')
          .select('key, value')
        if (err) throw err;
        const map: Record<string, unknown> = {}
        for (const row of (data ?? []) as { key: string; value: unknown }[]) {
          map[row.key] = row.value
        }
        cachedSettings = map;
        return map;
      })().finally(() => {
        settingsPromise = null;
      });
    }

    settingsPromise
      .then((map) => {
        if (isMounted && map) {
          setSettings(map);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [])

  return { settings, loading, error }
}
