import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to top when the route changes. Place inside a Router. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
