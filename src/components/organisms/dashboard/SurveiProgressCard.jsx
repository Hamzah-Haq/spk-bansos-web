import { BELUM_DISURVEI, PROGRESS_SEGMENTS } from '../../../lib/survei.js'
import Badge from '../../atoms/Badge.jsx'
import Card from '../../molecules/Card.jsx'
import StackedBar, { StackedBarLegend } from '../../molecules/StackedBar.jsx'

const PERIODE_STATUS = {
  open: {
    label: 'Dibuka',
    tone: 'success',
  },
  closed: {
    label: 'Ditutup',
    tone: 'warning',
  },
  final: {
    label: 'Final',
    tone: 'primary',
  },
}

// Survey progress of the current periode: how many KK are at each step, out of all KK.
export default function SurveiProgressCard({ dashboard }) {
  const { periode, kk, survei } = dashboard
  const segments = PROGRESS_SEGMENTS.map((s) => ({ ...s, value: survei[s.key] }))

  if (!periode) {
    return (
      <Card title="Progres Survei">
        <p className="text-sm text-fg-muted">Belum ada periode bansos.</p>
      </Card>
    )
  }

  return (
    <Card
      title="Progres Survei"
      description={`Periode ${periode.nama} (${periode.tahun}) · kuota ${periode.kuota} KK`}
      actions={<Badge tone={PERIODE_STATUS[periode.status].tone}>{PERIODE_STATUS[periode.status].label}</Badge>}
    >
      <div className="space-y-3">
        <StackedBar
          label="Progres survei"
          segments={segments}
          total={kk.total}
        />
        <StackedBarLegend
          segments={segments}
          rest={{ ...BELUM_DISURVEI, value: kk.belumDisurvei }}
        />
      </div>
    </Card>
  )
}
