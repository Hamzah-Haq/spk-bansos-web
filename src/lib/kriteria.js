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

// The criterion's value X for one survey: average of its questions' scores, with the worked formula
// ("C4 = (4 + 5 + 3) / 3"). skorByPertanyaan = { [pertanyaanId]: skor }; value null if incomplete.
export function nilaiKriteria(kriteria, skorByPertanyaan) {
  const skor = kriteria.pertanyaan.map((p) => skorByPertanyaan[p.id])
  if (!skor.length || skor.some((s) => s == null)) return { nilai: null, rumus: null }

  const nilai = skor.reduce((sum, s) => sum + s, 0) / skor.length
  const rumus =
    skor.length === 1
      ? `${kriteria.kode} = ${skor[0]}`
      : `${kriteria.kode} = (${skor.join(' + ')}) / ${skor.length}`
  return { nilai, rumus }
}

// Options the survey form needs before a question can be answered
export const MIN_OPSI = 2
