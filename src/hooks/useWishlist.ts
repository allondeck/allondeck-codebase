import { useState, useEffect, useCallback } from 'react'

const WISHLIST_KEY = 'wishlist_product_ids'
const MAX_ITEMS = 100

function getStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string').slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

function storeIds(ids: string[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)))
  } catch {
    // ignore
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>(() => getStoredIds())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as unknown
          if (Array.isArray(parsed)) setIds(parsed.filter((x): x is string => typeof x === 'string'))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((productId: string) => {
    setIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId].slice(-MAX_ITEMS)
      storeIds(next)
      return next
    })
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => ids.includes(productId),
    [ids]
  )

  return { wishlistIds: ids, toggle, isInWishlist }
}
