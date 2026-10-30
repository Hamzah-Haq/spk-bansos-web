import { formatAngka, formatBobot } from '../../../lib/format.js'
import { SIFAT } from '../../../lib/kriteria.js'
import Badge from '../../atoms/Badge.jsx'
import DataTable from '../DataTable.jsx'

// Criteria as SAW uses them: sifat, normalization formula and bobot. With a run's snapshot
// (kriteria[] carries min/max) it also shows the min and max that normalization divided by.
export default function KriteriaSawTable({ kriteria, loading, error, onRetry }) {
  const withMinMax = kriteria?.some((k) => k.min != null)

  const columns = [
    {
      key: 'kode',
      header: 'Kode',
      className: 'font-semibold',
    },
    {
      key: 'nama',
      header: 'Kriteria',
    },
    {
      key: 'sifat',
      header: 'Sifat',
      render: (k) => <Badge tone={SIFAT[k.sifat].tone}>{SIFAT[k.sifat].label}</Badge>,
    },
    {
      key: 'rumus',
      header: 'Normalisasi',
      className: 'font-mono text-xs whitespace-nowrap text-fg-muted',
      render: (k) => SIFAT[k.sifat].rumus,
    },
    ...(withMinMax
      ? [
          {
            key: 'min',
            header: 'Min',
            className: 'text-right font-mono',
            render: (k) => formatAngka(k.min),
          },
          {
            key: 'max',
            header: 'Max',
            className: 'text-right font-mono',
            render: (k) => formatAngka(k.max),
          },
        ]
      : []),
    {
      key: 'bobot',
      header: 'Bobot',
      className: 'text-right font-mono',
      render: (k) => formatBobot(k.bobot),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={kriteria}
      rowKey="kode"
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyMessage="Belum ada kriteria"
    />
  )
}
