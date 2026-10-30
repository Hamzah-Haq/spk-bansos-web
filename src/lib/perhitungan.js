// Display helpers for SAW runs (perhitungan). The math itself runs in the API (src/lib/saw.js there);
// these only explain the stored numbers.
import { formatAngka, formatBobot } from './format.js'

// Provisional tie-break rule (open decision #4), worded for the desa. Keep in sync with the API.
export const ATURAN_SERI =
  'Jika nilai V sama, urutan ditentukan oleh nilai r pada kriteria berbobot terbesar, lalu jumlah ' +
  'anggota keluarga terbanyak, lalu No. KK terkecil.'

// Normalization with the run's min/max filled in: benefit "4,5 / 5", cost "1 / 2"
export function rumusNormalisasi(kriteria, x) {
  return kriteria.sifat === 'benefit'
    ? `${formatAngka(x)} / ${formatAngka(kriteria.max)}`
    : `${formatAngka(kriteria.min)} / ${formatAngka(x)}`
}

// One row per criterion for a KK's breakdown: X, r and its formula, bobot and w·r
export function rincianHasil(kriteria, hasil) {
  return kriteria.map((k) => {
    const x = hasil.nilai[k.kode]
    const r = hasil.normalisasi[k.kode]
    return {
      ...k,
      x,
      r,
      rumus: rumusNormalisasi(k, x),
      kontribusi: k.bobot * r,
    }
  })
}

// Checklist before running SAW for a periode; `siap` = nothing blocking.
// ringkasan = { draft, submitted, verified, rejected } of that periode
export function kesiapanPerhitungan({ periode, ringkasan, totalBobot }) {
  const items = []
  let siap = true

  if (periode.status === 'final') {
    siap = false
    items.push({
      tone: 'danger',
      text: `Periode "${periode.nama}" sudah final; perhitungan tidak dapat dijalankan lagi.`,
    })
  }

  if (Math.round(totalBobot * 1000) !== 1000) {
    siap = false
    items.push({
      tone: 'danger',
      text: `Total bobot kriteria ${formatBobot(totalBobot)}, seharusnya 1,000.`,
      to: 'kriteria',
    })
  } else {
    items.push({
      tone: 'success',
      text: 'Total bobot kriteria 1,000.',
    })
  }

  if (!ringkasan.verified) {
    siap = false
    items.push({
      tone: 'danger',
      text: 'Belum ada survei terverifikasi pada periode ini.',
      to: 'verifikasi',
    })
  } else {
    items.push({
      tone: 'success',
      text: `${ringkasan.verified} survei terverifikasi akan dihitung.`,
    })
  }

  if (ringkasan.submitted) {
    items.push({
      tone: 'warning',
      text: `${ringkasan.submitted} survei masih menunggu verifikasi dan tidak ikut dihitung.`,
      to: 'verifikasi',
    })
  }
  if (ringkasan.draft + ringkasan.rejected) {
    items.push({
      tone: 'info',
      text: `${ringkasan.draft + ringkasan.rejected} survei masih draf atau perlu revisi dan tidak ikut dihitung.`,
    })
  }
  if (periode.status === 'open') {
    items.push({
      tone: 'info',
      text: 'Periode masih dibuka, jadi survei baru masih bisa masuk. Perhitungan dapat diulang kapan saja.',
    })
  }

  return {
    items,
    siap,
  }
}
