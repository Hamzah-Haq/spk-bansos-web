import { ListTree } from 'lucide-react'
import { formatDesimal, formatRt } from '../../../lib/format.js'
import { ATURAN_SERI } from '../../../lib/perhitungan.js'
import Badge from '../../atoms/Badge.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import DataTable from '../DataTable.jsx'

// Ranking of one SAW run (hasil[] already sorted by ranking); onRincian(hasil) opens the breakdown.
export default function RankingTable({ hasil, emptyMessage, onRincian }) {
  const rows = hasil.map((h) => ({ ...h, id: h.kk.id }))

  const columns = [
    {
      key: 'ranking',
      header: 'Rank',
      className: 'w-16 text-center font-semibold',
    },
    {
      key: 'kk',
      header: 'Kepala Keluarga',
      render: (h) => (
        <div>
          <p className="font-medium">{h.kk.kepalaKeluarga}</p>
          <p className="font-mono text-xs text-fg-muted">{h.kk.noKk}</p>
        </div>
      ),
    },
    {
      key: 'rt',
      header: 'Wilayah',
      className: 'whitespace-nowrap',
      render: (h) => formatRt(h.kk.rt),
    },
    {
      key: 'nilaiV',
      header: 'Nilai V',
      className: 'text-right font-mono',
      render: (h) => formatDesimal(h.nilaiV),
    },
    {
      key: 'status',
      header: 'Keputusan',
      render: (h) => (
        <div className="flex flex-wrap gap-1.5">
          {h.layak ? <Badge tone="success">Layak</Badge> : <Badge>Tidak layak</Badge>}
          {h.seri && (
            <span title={ATURAN_SERI}>
              <Badge tone="warning">V seri</Badge>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (h) => (
        <div className="flex justify-end">
          <IconButton
            icon={ListTree}
            label="Lihat rincian perhitungan"
            tone="primary"
            onClick={() => onRincian(h)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={rows}
      emptyMessage={emptyMessage}
    />
  )
}
