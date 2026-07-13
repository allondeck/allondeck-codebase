/**
 * Parse invoice-like data (CSV, Excel, or pasted text) into rows of record objects.
 * First row is treated as headers (normalized to lowercase, trimmed).
 */
import { parseCsv } from './csvParse'
import * as XLSX from 'xlsx'

export type ParsedInvoiceRow = Record<string, string>

/** Parse CSV or tab/comma pasted text into rows */
export function parseTextToRows(text: string): ParsedInvoiceRow[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  // If first line looks like tab-separated, split by tabs; else use CSV parser
  const firstLine = trimmed.split(/\r?\n/)[0] ?? ''
  if (firstLine.includes('\t') && !firstLine.includes('"')) {
    return parseDelimited(trimmed, '\t')
  }
  return parseCsv(trimmed)
}

/** Parse tab or comma delimited text (first row = headers) */
function parseDelimited(text: string, delimiter: string): ParsedInvoiceRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase())
  const rows: ParsedInvoiceRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter)
    const row: ParsedInvoiceRow = {}
    headers.forEach((h, j) => {
      row[h] = (values[j] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

/** Parse CSV text (re-export for consistency) */
export function parseCsvToRows(text: string): ParsedInvoiceRow[] {
  return parseCsv(text)
}

/** Parse Excel file (first sheet, first row = headers) */
export function parseExcelToRows(arrayBuffer: ArrayBuffer): ParsedInvoiceRow[] {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!firstSheet) return []
  const data = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1, defval: '' })
  if (!Array.isArray(data) || data.length === 0) return []
  const headerRow = data[0]
  const headers = (headerRow ?? []).map((h) => String(h ?? '').trim().toLowerCase())
  const rows: ParsedInvoiceRow[] = []
  for (let i = 1; i < data.length; i++) {
    const values = data[i] ?? []
    const row: ParsedInvoiceRow = {}
    headers.forEach((h, j) => {
      const v = values[j]
      row[h] = v != null ? String(v).trim() : ''
    })
    rows.push(row)
  }
  return rows
}

export { detectQuantityKey, detectSkuKey, detectNameKey } from './csvParse'

const EMAIL_HEADERS = ['email', 'customer email', 'customer_email', 'e-mail']
const CUSTOMER_NAME_HEADERS = ['customer name', 'customer_name', 'full name', 'full_name', 'name', 'ship to', 'shipping name']
const ADDRESS_HEADERS = ['address', 'street', 'line1', 'address line 1', 'city', 'state', 'postal code', 'zip', 'country', 'phone']

export function detectEmailKey(headers: string[]): string | null {
  const h = headers.map((x) => x.trim().toLowerCase())
  return EMAIL_HEADERS.find((key) => h.includes(key)) ?? null
}

export function detectCustomerNameKey(headers: string[]): string | null {
  const h = headers.map((x) => x.trim().toLowerCase())
  return CUSTOMER_NAME_HEADERS.find((key) => h.includes(key)) ?? null
}

export function detectAddressKeys(headers: string[]): Record<string, string> {
  const h = headers.map((x) => x.trim().toLowerCase())
  const out: Record<string, string> = {}
  for (const key of ADDRESS_HEADERS) {
    const found = h.find((x) => x === key || x.replace(/\s+/g, ' ').includes(key))
    if (found) out[key] = found
  }
  return out
}
