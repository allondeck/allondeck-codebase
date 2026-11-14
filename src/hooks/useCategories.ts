import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CategoryRow } from '../types/database'

let cachedCategories: CategoryRow[] | null = null;
let categoriesPromise: Promise<CategoryRow[] | null> | null = null;

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>(() => cachedCategories ?? [])
  const [loading, setLoading] = useState(() => cachedCategories === null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true;
    if (cachedCategories) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    if (!categoriesPromise) {
      categoriesPromise = (async () => {
        const { data, error: err } = await supabase
          .from('categories')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true });
        if (err) throw err;
        const list = (data ?? []) as CategoryRow[];
        cachedCategories = list;
        return list;
      })().finally(() => {
        categoriesPromise = null;
      });
    }

    categoriesPromise
      .then((list) => {
        if (isMounted && list) {
          setCategories(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [])

  return { categories, loading, error }
}
