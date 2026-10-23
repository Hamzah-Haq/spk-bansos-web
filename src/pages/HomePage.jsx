import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// Temporary landing page: proves browser → API → database wiring. Replace with /login later.
export default function HomePage() {
  const [health, setHealth] = useState({ state: 'loading' })

  useEffect(() => {
    api('/health')
      .then((data) => setHealth({ state: 'ok', data }))
      .catch((err) => setHealth({ state: 'error', message: err.message }))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">SPK Penerima Bansos</h1>
        <p className="mt-1 text-sm text-slate-500">Metode Simple Additive Weighting (SAW)</p>

        <dl className="mt-6 space-y-2 text-sm">
          <StatusRow label="API" ok={health.state === 'ok'} loading={health.state === 'loading'} />
          <StatusRow
            label="Database"
            ok={health.state === 'ok' && health.data.db === 'up'}
            loading={health.state === 'loading'}
          />
        </dl>

        {health.state === 'error' && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{health.message}</p>
        )}
      </div>
    </main>
  )
}

function StatusRow({ label, ok, loading }) {
  const text = loading ? 'memeriksa…' : ok ? 'terhubung' : 'tidak terhubung'
  const color = loading ? 'text-slate-400' : ok ? 'text-emerald-600' : 'text-red-600'
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <dt>{label}</dt>
      <dd className={`font-medium ${color}`}>{text}</dd>
    </div>
  )
}
