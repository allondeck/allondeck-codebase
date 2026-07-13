import { useState, useEffect, useMemo } from 'react'
import { Button } from '../../components/Button'
import { useDealsAdmin } from '../../hooks/useDealsAdmin'
import { useProductsAdmin } from '../../hooks/useProductsAdmin'
import { formatPrice } from '../../lib/utils'

export function ComboDealsManager() {
  const { deals, loading, createDeal, updateDeal, deleteDeal } = useDealsAdmin()
  const { products } = useProductsAdmin()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [formName, setFormName] = useState('')
  const [formTotalPrice, setFormTotalPrice] = useState('')
  const [formItems, setFormItems] = useState<{ product_id: string; quantity: number }[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemsTotal = useMemo(() => {
    return formItems.reduce((sum, item) => {
      const p = products.find((x) => x.id === item.product_id)
      return sum + (p?.price ?? 0) * item.quantity
    }, 0)
  }, [formItems, products])

  useEffect(() => {
    const pct = parseFloat(discountPercent)
    if (!Number.isNaN(pct) && pct >= 0 && pct <= 100) {
      const discounted = itemsTotal * (1 - pct / 100)
      setFormTotalPrice(discounted.toFixed(2))
    }
  }, [formItems, discountPercent, itemsTotal])

  function openAdd() {
    setAdding(true)
    setEditingId(null)
    setFormName('')
    setFormTotalPrice('')
    setFormItems([])
    setProductSearch('')
    setDiscountPercent('')
    setError(null)
  }

  function openEdit(deal: { id: string; name: string; total_price: number; deal_items: { product_id: string; quantity: number }[] }) {
    setAdding(false)
    setEditingId(deal.id)
    setFormName(deal.name)
    setFormTotalPrice(String(deal.total_price))
    setFormItems(deal.deal_items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })))
    setProductSearch('')
    setDiscountPercent('')
    setError(null)
  }

  function cancelForm() {
    setAdding(false)
    setEditingId(null)
    setError(null)
  }

  async function handleSave() {
    const total = parseFloat(formTotalPrice)
    if (Number.isNaN(total) || total < 0) {
      setError('Enter a valid total price.')
      return
    }
    if (formItems.length === 0) {
      setError('Add at least one product to the combo.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (adding) {
        await createDeal(formName, total, formItems)
        cancelForm()
      } else if (editingId) {
        await updateDeal(editingId, formName, total, formItems)
        cancelForm()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save deal')
    } finally {
      setSaving(false)
    }
  }

  function addProduct(productId: string) {
    if (formItems.some((i) => i.product_id === productId)) return
    setFormItems((prev) => [...prev, { product_id: productId, quantity: 1 }])
  }

  function removeProduct(productId: string) {
    setFormItems((prev) => prev.filter((i) => i.product_id !== productId))
  }

  function setQuantity(productId: string, qty: number) {
    setFormItems((prev) => prev.map((i) => (i.product_id === productId ? { ...i, quantity: Math.max(1, qty) } : i)))
  }

  const showForm = adding || editingId

  return (
    <div className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight text-[#f6ebd4]">Combo deals</h3>
      <p className="mt-2 text-sm text-[#76abbf] leading-relaxed">
        Create bundles: select any number of products and set one total price. Products in a combo appear when customers use the &quot;Deals&quot; filter. Enable the Deals filter in Store Settings → Storefront → Filters to show.
      </p>
      {loading ? (
        <p className="mt-4 text-sm text-[#76abbf]">Loading deals…</p>
      ) : (
        <>
          {!showForm && (
            <div className="mt-5 space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#066175]/35 bg-[#066175]/15 p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-white">{deal.name || 'Combo deal'}</p>
                    <p className="text-sm text-[#76abbf]">
                      {deal.deal_items.length} item(s) · {formatPrice(deal.total_price)} total
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(deal)}
                      className="rounded border border-[#066175]/35 bg-[#052631] px-2 py-1 text-sm font-medium text-white hover:bg-[#066175]/30"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Remove this combo deal?')) deleteDeal(deal.id)
                      }}
                      className="rounded border border-red-900/50 bg-red-955/20 px-2 py-1 text-sm font-medium text-red-400 hover:bg-red-955/40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={openAdd}
                className="w-full rounded-xl border border-dashed border-[#066175]/60 bg-[#044155] py-3.5 text-sm font-medium text-white transition-colors hover:border-[#e38622] hover:bg-[#066175]/20"
              >
                + Add combo deal
              </button>
            </div>
          )}
          {showForm && (
            <div className="mt-5 rounded-xl border border-[#066175]/35 bg-[#052631] p-6 shadow-sm">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white">Deal name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Starter bundle"
                className="w-full rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2.5 text-sm placeholder-[#76abbf] focus:border-[#e38622] focus:outline-none focus:ring-2 focus:ring-[#e38622]/20"
              />
            </div>

            {/* Add products below — first so owner picks from list, then sees selected */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-[#76abbf]">Add products below</p>
              <input
                type="search"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="mt-2 w-full rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2.5 text-sm placeholder-[#76abbf] focus:border-[#e38622] focus:outline-none focus:ring-2 focus:ring-[#e38622]/20"
                aria-label="Search products to add to combo"
              />
              <div className="mt-2 max-h-36 overflow-y-auto rounded-xl border border-[#066175]/35 bg-[#044155] p-2.5 space-y-1">
                {(() => {
                  const searchLower = productSearch.trim().toLowerCase()
                  const available = products
                    .filter((p) => !formItems.some((i) => i.product_id === p.id))
                    .filter((p) => !searchLower || p.name.toLowerCase().includes(searchLower))
                  return (
                    <>
                      {available.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addProduct(p.id)}
                          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-[#066175]/30 hover:shadow-sm"
                        >
                          + {p.name} <span className="text-[#76abbf]">— {formatPrice(p.price)}</span>
                        </button>
                      ))}
                      {available.length === 0 && (
                        <p className="px-3 py-4 text-center text-sm text-[#76abbf]">
                          {products.length === 0
                            ? 'No products. Add products in Products first.'
                            : searchLower
                              ? 'No products match your search.'
                              : 'All products are already in this combo.'}
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-[#76abbf]">Products in this combo</p>
              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-[#066175]/35 bg-[#044155] p-2.5 space-y-1.5">
                {formItems.map((item) => {
                  const p = products.find((x) => x.id === item.product_id)
                  return (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#066175]/35 bg-[#052631] px-3 py-2.5 shadow-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-white">
                        {p?.name ?? item.product_id}
                        {p != null && <span className="ml-2 text-[#76abbf]">({formatPrice(p.price)} each)</span>}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => setQuantity(item.product_id, parseInt(e.target.value, 10) || 1)}
                          className="w-16 rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-2 py-1.5 text-center text-sm focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(item.product_id)}
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-955/20"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {formItems.length > 0 && (
              <div className="mt-5 rounded-xl border border-indigo-900/35 bg-indigo-950/15 p-4">
                <p className="text-sm font-medium text-white">
                  Selected items value: <span className="text-lg font-semibold text-indigo-300">{formatPrice(itemsTotal)}</span>
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-6">
                  <div className="space-y-1">
                    <label htmlFor="combo-discount-pct" className="block text-sm font-medium text-white">Discount %</label>
                    <input
                      id="combo-discount-pct"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      placeholder="0"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-24 rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2 text-sm focus:border-[#e38622] focus:outline-none focus:ring-2 focus:ring-[#e38622]/20"
                      aria-label="Discount percentage applied to items total"
                    />
                    <p className="text-xs text-[#76abbf]">Applied to items total → updates Total price</p>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="combo-total-price" className="block text-sm font-medium text-white">Total price ($)</label>
                    <input
                      id="combo-total-price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formTotalPrice}
                      onChange={(e) => setFormTotalPrice(e.target.value)}
                      className="w-36 rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2 text-sm font-medium focus:border-[#e38622] focus:outline-none focus:ring-2 focus:ring-[#e38622]/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            <div className="mt-6 flex gap-3 border-t border-[#066175]/35 pt-5">
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save combo'}
              </Button>
              <Button variant="secondary" type="button" onClick={cancelForm} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
          )}
        </>
      )}
    </div>
  )
}
