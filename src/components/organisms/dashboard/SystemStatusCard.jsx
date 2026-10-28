import Card from '../../molecules/Card.jsx'
import InfoRow from '../../molecules/InfoRow.jsx'

// health = { state: 'loading' } | { state: 'ok', data } | { state: 'error', message } from GET /health
export default function SystemStatusCard({ health }) {
  return (
    <Card title="Status Sistem">
      <dl className="space-y-3 text-sm">
        <StatusRow
          label="API"
          ok={health.state === 'ok'}
          loading={health.state === 'loading'}
        />
        <StatusRow
          label="Database"
          ok={health.state === 'ok' && health.data.db === 'up'}
          loading={health.state === 'loading'}
        />
      </dl>
      {health.state === 'error' && (
        <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{health.message}</p>
      )}
    </Card>
  )
}

function StatusRow({ label, ok, loading }) {
  const text = loading ? 'memeriksa…' : ok ? 'terhubung' : 'tidak terhubung'
  const color = loading ? 'text-fg-muted' : ok ? 'text-success' : 'text-danger'
  return (
    <InfoRow label={label}>
      <span className={color}>{text}</span>
    </InfoRow>
  )
}
