export function formatRt(rt) {
  return rt ? `RT ${rt.noRt} / RW ${rt.noRw}` : 'Seluruh desa'
}

// ISO timestamp from the API → "28 Okt 2026, 14.05"; null → "–"
export function formatTanggal(iso) {
  if (!iso) return '–'
  return new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Plain number in Indonesian notation, up to 3 decimals: 4.3333 → "4,333", 4.5 → "4,5"
export function formatAngka(value) {
  return value.toLocaleString('id-ID', { maximumFractionDigits: 3 })
}

// Criteria weight in Indonesian notation: 0.3 → "0,300"
export function formatBobot(value) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

// Accepts "0,3" and "0.3" (users type the Indonesian decimal comma); NaN when not a number
export function parseDecimal(text) {
  const normalized = String(text).trim().replace(',', '.')
  return /^\d*\.?\d+$/.test(normalized) ? Number(normalized) : NaN
}
