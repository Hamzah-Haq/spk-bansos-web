import { useId } from 'react'
import { X } from 'lucide-react'
import { formatAngka, formatBobot, formatDesimal, formatRt } from '../../../lib/format.js'
import { SIFAT } from '../../../lib/kriteria.js'
import { ATURAN_SERI, rincianHasil } from '../../../lib/perhitungan.js'
import Badge from '../../atoms/Badge.jsx'
import Button from '../../atoms/Button.jsx'
import Modal from '../Modal.jsx'

// Why a KK got its V: per criterion X → r (with the run's min/max) → w·r, then V = Σ w·r.
// This is what the desa shows a resident who asks about the result.
export default function RincianModal({ perhitungan, hasil, onClose }) {
  const titleId = useId()
  const rows = rincianHasil(perhitungan.kriteria, hasil)

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      labelledBy={titleId}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h2 id={titleId} className="text-lg font-semibold">
            Rincian Perhitungan · {hasil.kk.kepalaKeluarga}
          </h2>
          <p className="mt-0.5 text-sm text-fg-muted">
            No. KK {hasil.kk.noKk} · {formatRt(hasil.kk.rt)} · {hasil.kk.jumlahAnggota} anggota keluarga
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-lg p-1 text-fg-muted hover:bg-surface-alt hover:text-fg"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold">
            Ranking {hasil.ranking} dari {perhitungan.jumlahAlternatif}
          </span>
          {hasil.layak ? <Badge tone="success">Layak</Badge> : <Badge>Tidak layak</Badge>}
          <span className="text-fg-muted">Kuota {perhitungan.periode.kuota} KK</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-xs font-semibold tracking-wide text-fg-muted uppercase">
              <tr>
                <th scope="col" className="px-3 py-2">Kriteria</th>
                <th scope="col" className="px-3 py-2 text-right">Nilai X</th>
                <th scope="col" className="px-3 py-2">Normalisasi r</th>
                <th scope="col" className="px-3 py-2 text-right">Bobot w</th>
                <th scope="col" className="px-3 py-2 text-right">w × r</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.kode}>
                  <td className="px-3 py-2">
                    <p className="font-medium">
                      {row.kode} · {row.nama}
                    </p>
                    <p className="text-xs text-fg-muted">{SIFAT[row.sifat].label}</p>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{formatAngka(row.x)}</td>
                  <td className="px-3 py-2 font-mono whitespace-nowrap">
                    <span className="text-fg-muted">{row.rumus} = </span>
                    {formatDesimal(row.r)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{formatBobot(row.bobot)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatDesimal(row.kontribusi)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-border bg-surface-alt">
              <tr>
                <td colSpan={4} className="px-3 py-2 font-semibold">
                  Nilai preferensi V = Σ (w × r)
                </td>
                <td className="px-3 py-2 text-right font-mono font-semibold">{formatDesimal(hasil.nilaiV)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-fg-muted">
          Angka ditampilkan dengan pembulatan 4 desimal; V dihitung dari nilai tanpa pembulatan. Min dan max
          diambil dari seluruh KK pada perhitungan ini.
        </p>
        {hasil.seri && <p className="text-xs text-warning">Nilai V sama dengan KK lain. {ATURAN_SERI}</p>}
      </div>

      <div className="flex justify-end border-t border-border px-6 py-4">
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  )
}
