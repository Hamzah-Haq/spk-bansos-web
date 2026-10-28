import { formatRt } from '../../../lib/format.js'
import { PROGRESS_SEGMENTS } from '../../../lib/survei.js'
import StackedBar from '../../molecules/StackedBar.jsx'
import DataTable from '../DataTable.jsx'

// Desa: survey progress per RT. The bar shows the shape, the columns give the exact numbers.
export default function RtProgressTable({ perRt }) {
  const columns = [
    {
      key: 'rt',
      header: 'Wilayah',
      className: 'whitespace-nowrap font-medium',
      render: (row) => formatRt(row.rt),
    },
    {
      key: 'jumlahKk',
      header: 'KK',
      className: 'text-right',
    },
    {
      key: 'progres',
      header: 'Progres',
      className: 'w-1/3 min-w-40',
      render: (row) => (
        <StackedBar
          size="sm"
          label={`Progres ${formatRt(row.rt)}`}
          segments={PROGRESS_SEGMENTS.map((s) => ({ ...s, value: row.survei[s.key] }))}
          total={row.jumlahKk}
        />
      ),
    },
    ...PROGRESS_SEGMENTS.map((s) => ({
      key: s.key,
      header: s.label,
      className: 'text-right whitespace-nowrap',
      render: (row) => row.survei[s.key],
    })),
    {
      key: 'belumDisurvei',
      header: 'Belum disurvei',
      className: 'text-right whitespace-nowrap',
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={perRt.map((row) => ({ ...row, id: row.rt.id }))}
      emptyMessage="Belum ada wilayah RT"
    />
  )
}
