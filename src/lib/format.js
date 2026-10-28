export function formatRt(rt) {
  return rt ? `RT ${rt.noRt} / RW ${rt.noRw}` : 'Seluruh desa'
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
