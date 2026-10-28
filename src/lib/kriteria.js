// Display data for criteria. The SAW math itself lives in the API.

export const SIFAT = {
  benefit: {
    label: 'Benefit',
    tone: 'success',
    rumus: 'r = x / max(x)',
    penjelasan: 'Semakin besar skor, semakin diprioritaskan.',
  },
  cost: {
    label: 'Cost',
    tone: 'warning',
    rumus: 'r = min(x) / x',
    penjelasan: 'Semakin kecil skor, semakin diprioritaskan.',
  },
}

export const SIFAT_OPTIONS = Object.entries(SIFAT).map(([value, { label }]) => ({ value, label }))

// A criterion's value is the average of its questions' scores (proposal Tabel 2.1):
// C1 = 1, C2 = (2a + 2b) / 2, C4 = (4a + 4b + 4c) / 3
export function rumusKonversi(kriteria) {
  const kode = kriteria.pertanyaan.map((p) => p.kode)
  if (kode.length === 0) return `${kriteria.kode} = –`
  if (kode.length === 1) return `${kriteria.kode} = ${kode[0]}`
  return `${kriteria.kode} = (${kode.join(' + ')}) / ${kode.length}`
}

// Options the survey form needs before a question can be answered
export const MIN_OPSI = 2
