import { Pencil } from 'lucide-react'
import { formatBobot } from '../../../lib/format.js'
import { SIFAT, rumusKonversi } from '../../../lib/kriteria.js'
import Badge from '../../atoms/Badge.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import DataTable from '../DataTable.jsx'

// C1–C5 with sifat, bobot and conversion formula; footer shows Σ bobot (must be 1,000).
export default function KriteriaTable({ query, onEdit }) {
  const rows = query.data?.data
  const totalBobot = query.data?.meta.totalBobot

  const columns = [
    {
      key: 'kode',
      header: 'Kode',
      className: 'font-semibold',
    },
    {
      key: 'nama',
      header: 'Kriteria',
      render: (k) => (
        <div>
          <p className="font-medium">{k.nama}</p>
          <p className="font-mono text-xs text-fg-muted">{rumusKonversi(k)}</p>
        </div>
      ),
    },
    {
      key: 'sifat',
      header: 'Sifat',
      render: (k) => (
        <span title={`${SIFAT[k.sifat].rumus}. ${SIFAT[k.sifat].penjelasan}`}>
          <Badge tone={SIFAT[k.sifat].tone}>{SIFAT[k.sifat].label}</Badge>
        </span>
      ),
    },
    {
      key: 'bobot',
      header: 'Bobot',
      className: 'text-right whitespace-nowrap',
      render: (k) => (
        <span>
          <span className="font-mono">{formatBobot(k.bobot)}</span>
          <span className="ml-2 text-xs text-fg-muted">({Math.round(k.bobot * 1000) / 10}%)</span>
        </span>
      ),
    },
    {
      key: 'pertanyaan',
      header: 'Pertanyaan',
      className: 'text-right',
      render: (k) => k.pertanyaan.length,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (k) => (
        <div className="flex justify-end">
          <IconButton
            icon={Pencil}
            label="Ubah nama atau sifat"
            tone="primary"
            onClick={() => onEdit(k)}
          />
        </div>
      ),
    },
  ]

  const totalOk = Math.round((totalBobot ?? 0) * 1000) === 1000

  return (
    <DataTable
      columns={columns}
      rows={rows}
      loading={query.loading}
      error={query.error}
      onRetry={query.reload}
      emptyMessage="Belum ada kriteria. Jalankan seed database."
      footer={
        rows?.length > 0 && (
          <div className="flex justify-end gap-2 border-t border-border px-4 py-3 text-sm">
            <span className="text-fg-muted">Total bobot (Σ w):</span>
            <span className={`font-mono font-semibold ${totalOk ? 'text-success' : 'text-danger'}`}>
              {formatBobot(totalBobot)}
            </span>
          </div>
        )
      }
    />
  )
}
