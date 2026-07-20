import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import {
  createOrderFromInvoice,
  type CreateOrderFromInvoiceInput,
  type InvoiceOrderItem,
  type ShippingAddressInput,
} from '../../lib/orders'
import {
  parseCsvToRows,
  parseExcelToRows,
  detectQuantityKey,
  detectSkuKey,
  detectNameKey,
  detectEmailKey,
  detectCustomerNameKey,
} from '../../lib/invoiceParse'

type ProductStub = {
  id: string
  name: string
  slug: string
  sku: string | null
  price: number
}

type LineRow = {
  product: ProductStub | null
  productLabel: string
  quantity: number
  price: number
}

const emptyAddress: ShippingAddressInput = {
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
}

export default function OwnerOrderFromInvoice() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductStub[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [inputMode, setInputMode] = useState<'csv' | 'excel'>('csv')
  const [parseError, setParseError] = useState<string | null>(null)
  const [lineRows, setLineRows] = useState<LineRow[]>([])
  const [customerEmail, setCustomerEmail] = useState('')
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressInput>(emptyAddress)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, sku, price')
      if (error) {
        setLoadingProducts(false)
        return
      }
      setProducts(
        (data ?? []).map((p: { id: string; name: string; slug: string; sku: string | null; price: unknown }) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: Number(p.price),
        }))
      )
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
        const byName = products.find((p) => p.name.trim().toLowerCase() === nameVal.toLowerCase())
        if (byName) return byName
      }
      return null
    },
    [products]
  )

  const processRows = useCallback(
    (rows: Record<string, string>[]) => {
      if (rows.length === 0) {
        setParseError('No data rows found.')
        return
      }
      const headers = Object.keys(rows[0] ?? {})
      const qKey = detectQuantityKey(headers)
      const skuKey = detectSkuKey(headers)
      const nameKey = detectNameKey(headers)
      const emailKey = detectEmailKey(headers)
      const nameKeyCustomer = detectCustomerNameKey(headers)

      if (!qKey) {
        setParseError('Could not find a quantity column. Use a header like "Quantity" or "Qty".')
        return
      }
      if (!skuKey && !nameKey) {
        setParseError('Could not find SKU or product name column.')
        return
      }

      const first = rows[0] ?? {}
      if (emailKey && (first[emailKey] ?? '').trim()) setCustomerEmail((first[emailKey] ?? '').trim())
      if (nameKeyCustomer && (first[nameKeyCustomer] ?? '').trim()) {
        setShippingAddress((a) => ({ ...a, full_name: (first[nameKeyCustomer] ?? '').trim() }))
      }

      const lines: LineRow[] = []
      for (const row of rows) {
        const qty = parseInt(row[qKey] ?? '0', 10)
        if (!Number.isFinite(qty) || qty <= 0) continue
        const product = matchRowToProduct(row, skuKey, nameKey)
        const skuOrName = (skuKey ? row[skuKey] : nameKey ? row[nameKey] : '').trim() || '—'
        lines.push({
          product,
          productLabel: product ? product.name : skuOrName,
          quantity: qty,
          price: product ? product.price : 0,
        })
      }
      setLineRows(lines)
      setParseError(null)
    },
    [matchRowToProduct]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setParseError(null)
      setLineRows([])
      const f = e.target.files?.[0]
      if (!f) return
      const reader = new FileReader()
      if (inputMode === 'excel') {
        reader.onload = () => {
          try {
            const rows = parseExcelToRows(reader.result as ArrayBuffer)
            processRows(rows)
          } catch (err) {
            setParseError(err instanceof Error ? err.message : 'Failed to read Excel.')
          }
        }
        reader.readAsArrayBuffer(f)
      } else {
        reader.onload = () => {
          try {
            const rows = parseCsvToRows(String(reader.result ?? ''))
            processRows(rows)
          } catch (err) {
            setParseError(err instanceof Error ? err.message : 'Failed to parse CSV.')
          }
        }
        reader.readAsText(f, 'UTF-8')
      }
    },
    [inputMode, processRows]
  )

  const updateLineQuantity = useCallback((index: number, quantity: number) => {
    setLineRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, quantity: Math.max(0, Math.floor(quantity)) } : row))
    )
  }, [])

  const updateLinePrice = useCallback((index: number, price: number) => {
    setLineRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, price: Math.max(0, Number(price)) } : row))
    )
  }, [])

  const removeLine = useCallback((index: number) => {
    setLineRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const validItems = lineRows.filter((r) => r.product && r.quantity > 0) as (LineRow & { product: ProductStub })[]

  const handleCreateOrder = useCallback(async () => {
    if (validItems.length === 0) {
      setParseError('Add at least one product with quantity.')
      return
    }
    if (!customerEmail.trim()) {
      setParseError('Customer email is required.')
      return
    }
    setCreating(true)
    setParseError(null)
    try {
      const items: InvoiceOrderItem[] = validItems.map((r) => ({
        product: { id: r.product.id, name: r.product.name, price: r.price },
        quantity: r.quantity,
      }))
      const input: CreateOrderFromInvoiceInput = {
        items,
        customerEmail: customerEmail.trim(),
        shippingAddress:
          shippingAddress.full_name ||
          shippingAddress.line1 ||
          shippingAddress.city ||
          shippingAddress.postal_code ||
          shippingAddress.country
            ? shippingAddress
            : undefined,
      }
      const orderId = await createOrderFromInvoice(input)
      navigate(`/owner/orders/${orderId}`)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setCreating(false)
    }
  }, [validItems, customerEmail, shippingAddress, navigate])

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
        <Link to="/owner/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Orders
        </Link>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Create order from invoice</h2>
      <p className="mt-1 text-sm text-gray-500">
        Upload a CSV or Excel file. Include columns for <strong>product</strong> (SKU or name) and <strong>quantity</strong>. You can then edit line items and customer details before creating the order.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        {(['csv', 'excel'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setInputMode(mode)
              setParseError(null)
              setLineRows([])
            }}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              inputMode === mode
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {mode === 'csv' ? 'Upload CSV' : 'Upload Excel'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          {inputMode === 'csv' ? 'CSV file' : 'Excel file (.xlsx)'}
        </label>
        <input
          type="file"
          accept={inputMode === 'csv' ? '.csv' : '.xlsx,.xls'}
          onChange={handleFileChange}
          className="mt-1 block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      {parseError && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{parseError}</div>
      )}

      {lineRows.length > 0 && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Order items — confirm or edit</h3>
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Product</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Unit price</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Line total</th>
                    <th className="w-10 px-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {lineRows.map((row, idx) => (
                    <tr key={idx} className={row.product ? '' : 'bg-amber-50'}>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {row.product ? row.product.name : row.productLabel}
                        {!row.product && (
                          <span className="ml-2 text-xs text-amber-700">(no match — remove or add product)</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={row.quantity}
                          onChange={(e) => updateLineQuantity(idx, parseInt(e.target.value, 10) || 0)}
                          className="w-16 rounded border border-gray-300 px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={row.price}
                          onChange={(e) => updateLinePrice(idx, parseFloat(e.target.value) || 0)}
                          className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {(row.quantity * row.price).toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-medium text-gray-900">Customer & shipping</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  value={shippingAddress.full_name}
                  onChange={(e) => setShippingAddress((a) => ({ ...a, full_name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Shipping name"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address line 1</label>
                <input
                  type="text"
                  value={shippingAddress.line1}
                  onChange={(e) => setShippingAddress((a) => ({ ...a, line1: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address line 2</label>
                <input
                  type="text"
                  value={shippingAddress.line2}
                  onChange={(e) => setShippingAddress((a) => ({ ...a, line2: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State / Province</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, state: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal code</label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, postal_code: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, country: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, phone: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={handleCreateOrder}
              disabled={creating || validItems.length === 0}
            >
              {creating ? 'Creating…' : 'Create order'}
            </Button>
            <p className="text-sm text-gray-500">
              Total: {validItems.reduce((sum, r) => sum + r.quantity * r.price, 0).toFixed(2)} (from {validItems.length} item(s))
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
