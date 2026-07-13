/**
 * Parse CSV text into rows of record objects.
 * First row is treated as headers (normalized to lowercase, trimmed).
 * Handles quoted fields that may contain commas.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) return []

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, j) => {
      row[h] = (values[j] ?? '').trim()
    })
    rows.push(row)
  }

  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      let end = i + 1
      const parts: string[] = []
      while (end < line.length) {
        if (line[end] === '"') {
          if (line[end + 1] === '"') {
            parts.push(line.slice(i + 1, end))
            i = end + 1
            end = end + 2
            continue
          }
          parts.push(line.slice(i + 1, end))
          result.push(parts.join('"').replace(/""/g, '"'))
          i = end + 1
          break
        }
        end++
      }
      if (end >= line.length) {
        result.push(line.slice(i + 1).replace(/""/g, '"'))
        break
      }
      continue
    }
    const comma = line.indexOf(',', i)
    if (comma === -1) {
      result.push(line.slice(i))
      break
    }
    result.push(line.slice(i, comma))
    i = comma + 1
  }
  return result
}

/** Normalize common CSV column names to a canonical key */
export function detectQuantityKey(headers: string[]): string | null {
  const qKeys = ['quantity', 'qty', 'qty received', 'quantity received', 'received', 'count', 'amount']
  const h = headers.map((x) => x.trim().toLowerCase())
  for (const key of qKeys) {
    const found = h.find((x) => x === key || x.replace(/\s+/g, ' ').includes(key))
    if (found) return found
  }
  return h.includes('quantity') ? 'quantity' : h.includes('qty') ? 'qty' : null
}

export function detectSkuKey(headers: string[]): string | null {
  const skuKeys = ['sku', 'product sku', 'sku code', 'item sku', 'product code', 'code']
  const h = headers.map((x) => x.trim().toLowerCase())
  for (const key of skuKeys) {
    const found = h.find((x) => x === key || x.replace(/\s+/g, ' ').includes(key))
    if (found) return found
  }
  return h.includes('sku') ? 'sku' : null
}

export function detectNameKey(headers: string[]): string | null {
  const nameKeys = ['name', 'product name', 'product', 'item', 'item name', 'description']
  const h = headers.map((x) => x.trim().toLowerCase())
  for (const key of nameKeys) {
    const found = h.find((x) => x === key || x.replace(/\s+/g, ' ').includes(key))
    if (found) return found
  }
  return h.includes('name') ? 'name' : h.includes('product name') ? 'product name' : null
}
