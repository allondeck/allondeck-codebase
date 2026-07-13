/** Returns carrier tracking URL for a tracking number, or null if no known URL */
export function getTrackingUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined): string | null {
  const num = (trackingNumber ?? '').trim()
  if (!num) return null
  const c = (carrier ?? '').trim().toUpperCase()
  if (c === 'USPS') return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(num)}`
  if (c === 'UPS') return `https://www.ups.com/track?tracknum=${encodeURIComponent(num)}`
  if (c === 'FEDEX') return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(num)}`
  if (c === 'DHL') return `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(num)}`
  return null
}
