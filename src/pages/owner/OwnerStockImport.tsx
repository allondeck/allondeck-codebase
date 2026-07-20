import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import {
  parseCsv,
  detectQuantityKey,
  detectSkuKey,
  detectNameKey,
} from '../../lib/csvParse'

type ProductStub = {
  id: string
  name: string
  slug: string
  sku: string | null
  stock_quantity: number
}

type MatchedRow = {
  product: ProductStub
  addQty: number
}

export default function OwnerStockImport() {
  const [products, setProducts] = useState<ProductStub[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [parseError, setParseError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{
    matched: MatchedRow[]
    unmatched: { skuOrName: string; qty: number }[]
  } | null>(null)
  const [previewEditing, setPreviewEditing] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, sku, stock_quantity')
      if (error) {
        setLoadingProducts(false)
        return
      }
      setProducts((data ?? []) as ProductStub[])
      setLoadingProducts(false)
    })()
  }, [])

  const matchRowToProduct = useCallback(
    (row: Record<string, string>, skuKey: string | null, nameKey: string | null): ProductStub | null => {
      const skuVal = skuKey ? (row[skuKey] ?? '').trim() : ''
      const nameVal = nameKey ? (row[nameKey] ?? '').trim() : ''
      const slugCand = (skuVal || nameVal).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      if (skuVal) {
        const bySku = products.find((p) => p.sku && p.sku.trim().toLowerCase() === skuVal.toLowerCase())
        if (bySku) return bySku
      }
      const bySlug = products.find((p) => p.slug.toLowerCase() === slugCand || p.slug === skuVal || p.slug === nameVal)
      if (bySlug) return bySlug
      if (nameVal) {
        const byName = products.find(
          (p) => p.name.trim().toLowerCase() === nameVal.toLowerCase()
        )
        if (byName) return byName
      }
      return null
    },
    [products]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setApplied(false)
      setPreview(null)
      setPreviewEditing(false)
      setParseError(null)
      const f = e.target.files?.[0]
      if (!f) return
      if (!f.name.toLowerCase().endsWith('.csv')) {
        setParseError('Please choose a CSV file.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const text = String(reader.result ?? '')
          const rows = parseCsv(text)
          if (rows.length === 0) {
            setParseError('CSV has no data rows.')
            return
          }
          const headers = Object.keys(rows[0] ?? {})
          const qKey = detectQuantityKey(headers)
          const skuKey = detectSkuKey(headers)
          const nameKey = detectNameKey(headers)

          if (!qKey) {
            setParseError('Could not find a quantity column. Use a header like "Quantity" or "Qty".')
            return
          }
          if (!skuKey && !nameKey) {
            setParseError('Could not find SKU or product name column. Use "SKU" or "Product Name" (or "Name").')
            return
          }

          const addByProductId = new Map<string, { product: ProductStub; addQty: number }>()
          const unmatched: { skuOrName: string; qty: number }[] = []

          for (const row of rows) {
            const qty = parseInt(row[qKey] ?? '0', 10)
            if (!Number.isFinite(qty) || qty <= 0) continue

            const product = matchRowToProduct(row, skuKey, nameKey)
            const skuOrName = (skuKey ? row[skuKey] : nameKey ? row[nameKey] : '').trim() || '—'
            if (!product) {
              unmatched.push({ skuOrName, qty })
              continue
            }
            const existing = addByProductId.get(product.id)
            if (existing) {
              existing.addQty += qty
            } else {
              addByProductId.set(product.id, { product, addQty: qty })
            }
          }

          setPreview({
            matched: Array.from(addByProductId.values()).map((x) => ({ product: x.product, addQty: x.addQty })),
            unmatched,
          })
        } catch (err) {
          setParseError(err instanceof Error ? err.message : 'Failed to parse CSV.')
        }
      }
      reader.readAsText(f, 'UTF-8')
    },
    [matchRowToProduct]
  )

  function setMatchedAddQty(productId: string, addQty: number) {
    setPreview((prev) =>
      prev
        ? {
            ...prev,
            matched: prev.matched.map((row) =>
              row.product.id === productId ? { ...row, addQty: Math.max(0, Math.floor(addQty)) } : row
            ),
          }
        : null
    )
  }

  const handleApply = useCallback(async () => {
    if (!preview || preview.matched.length === 0) return
    setApplying(true)
    try {
      for (const { product, addQty } of preview.matched) {
        if (addQty <= 0) continue
        const newStock = product.stock_quantity + addQty
        await (supabase.from('products') as ReturnType<typeof supabase.from>)
          .update({
            stock_quantity: Math.max(0, newStock),
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id)
      }
      setApplied(true)
      setPreview(null)
    } finally {
      setApplying(false)
    }
  }, [preview])

  if (loadingProducts) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/account/owner/products"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Products
        </Link>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Import stock from shipment (CSV)</h2>
      <p className="mt-1 text-sm text-gray-500">
        Upload a CSV from your shipment invoice. Include columns for <strong>SKU</strong> or <strong>Product name</strong> and <strong>Quantity</strong> (or Qty). We’ll match rows to your products and add the quantities to current stock.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">CSV file</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-1 block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      {parseError && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{parseError}</div>
      )}

      {preview && (
        <div className="mt-8 space-y-6">
          {preview.matched.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Preview — stock to add</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {previewEditing
                    ? 'Adjust the amounts below, then click &quot;Done&quot; or &quot;Update stock&quot; to apply.'
                    : 'Click &quot;Edit amounts&quot; to correct any quantities before applying.'}
                </p>
                <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Product</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">Current stock</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">Add</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">New stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {preview.matched.map(({ product, addQty }) => (
                        <tr key={product.id}>
                          <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                          <td className="px-4 py-2 text-right text-gray-600">{product.stock_quantity}</td>
                          <td className="px-4 py-2 text-right">
                            {previewEditing ? (
                              <input
                                type="number"
                                min={0}
                                value={addQty}
                                onChange={(e) =>
                                  setMatchedAddQty(product.id, parseInt(e.target.value, 10) || 0)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm text-green-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                            ) : (
                              <span className="text-green-600">+{addQty}</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            {product.stock_quantity + addQty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={handleApply}
                    disabled={applying || preview.matched.every((r) => r.addQty <= 0)}
                  >
                    {applying ? 'Updating…' : 'Update stock'}
                  </Button>
                  {previewEditing ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setPreviewEditing(false)}
                    >
                      Done
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setPreviewEditing(true)}
                    >
                      Edit amounts
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {preview.unmatched.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-amber-800">Unmatched rows (no product found)</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Add these as products or fix SKU/name in your CSV, then re-upload.
              </p>
              <div className="mt-2 overflow-x-auto rounded-lg border border-amber-200 bg-amber-50/50">
                <table className="min-w-full divide-y divide-amber-200 text-sm">
                  <thead className="bg-amber-100/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-amber-900">SKU / Name in CSV</th>
                      <th className="px-4 py-2 text-right font-medium text-amber-900">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-200">
                    {preview.unmatched.map((u, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-amber-900">{u.skuOrName}</td>
                        <td className="px-4 py-2 text-right text-amber-800">{u.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {preview.matched.length === 0 && preview.unmatched.length === 0 && (
            <p className="text-sm text-gray-500">No valid quantity rows in the CSV.</p>
          )}
        </div>
      )}

      {applied && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          Stock updated successfully. You can upload another CSV or go back to{' '}
          <Link to="/account/owner/products" className="font-medium underline hover:no-underline">
            Products
          </Link>
          .
        </div>
      )}
    </div>
  )
}
