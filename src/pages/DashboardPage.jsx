import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME, ROLE_LABELS } from '../auth/roles.js'
import { NAV } from '../layouts/navigation.js'
import { api } from '../lib/api.js'

export default function DashboardPage() {
  const { user } = useAuth()
  const [health, setHealth] = useState({ state: 'loading' })

  useEffect(() => {
    api('/health')
      .then((data) => setHealth({ state: 'ok', data }))
      .catch((err) => setHealth({ state: 'error', message: err.message }))
  }, [])

  const home = ROLE_HOME[user.role]
  const shortcuts = NAV[user.role].filter((item) => item.path)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat Datang, {user.nama}</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Sistem Pendukung Keputusan Penerima Bantuan Sosial menggunakan Metode Simple Additive Weighting (SAW).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Informasi Akun">
          <dl className="space-y-3 text-sm">
            <Row label="Nama">{user.nama}</Row>
            <Row label="Username">{user.username}</Row>
            <Row label="Jabatan">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {ROLE_LABELS[user.role]}
              </span>
            </Row>
            <Row label="Wilayah">{user.rt ? `RT ${user.rt.noRt} / RW ${user.rt.noRw}` : 'Seluruh desa'}</Row>
          </dl>
        </Card>

        {/* <Card title="Status Sistem">
          <dl className="space-y-3 text-sm">
            <StatusRow label="API" ok={health.state === 'ok'} loading={health.state === 'loading'} />
            <StatusRow
              label="Database"
              ok={health.state === 'ok' && health.data.db === 'up'}
              loading={health.state === 'loading'}
            />
          </dl>
          {health.state === 'error' && (
            <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{health.message}</p>
          )}
        </Card> */}
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Menu</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={`${home}/${path}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="size-4 text-fg-muted transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-fg-muted">{label}</dt>
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
