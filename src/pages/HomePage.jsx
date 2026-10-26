import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../lib/api.js'

export default function HomePage() {
  const { user, logout } = useAuth()
  const [health, setHealth] = useState({ state: 'loading' })

  useEffect(() => {
    api('/health')
      .then((data) => setHealth({ state: 'ok', data }))
      .catch((err) => setHealth({ state: 'error', message: err.message }))
  }, [])

  return (
    <main className="min-h-svh px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-semibold">SPK Penerima Bansos</h1>
        <p className="mt-1 text-sm text-fg-muted">Metode Simple Additive Weighting (SAW)</p>

        <dl className="mt-6 space-y-2 text-sm">
          <Row label="Masuk sebagai">
            {user.nama} ({user.username}, {user.role === 'desa' ? 'Perangkat Desa' : 'Ketua RT/RW'})
          </Row>
          <StatusRow label="API" ok={health.state === 'ok'} loading={health.state === 'loading'} />
          <StatusRow
            label="Database"
            ok={health.state === 'ok' && health.data.db === 'up'}
            loading={health.state === 'loading'}
          />
        </dl>

        {health.state === 'error' && (
          <p className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-danger">{health.message}</p>
        )}

        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-surface-alt"
        >
          Keluar
        </button>
      </div>
    </main>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt>{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}

function StatusRow({ label, ok, loading }) {
  const text = loading ? 'memeriksa…' : ok ? 'terhubung' : 'tidak terhubung'
  const color = loading ? 'text-fg-muted' : ok ? 'text-success' : 'text-danger'
  return (
    <Row label={label}>
      <span className={color}>{text}</span>
    </Row>
  )
}
