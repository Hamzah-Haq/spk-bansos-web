import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import {
  BadgeCheck,
  Calculator,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ScanSearch,
  User,
} from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME, isRolePath } from '../auth/roles.js'
import Brand from '../components/Brand.jsx'
import ThemePicker from '../components/ThemePicker.jsx'

const HIGHLIGHTS = [
  {
    icon: Calculator,
    title: 'Metode SAW',
    text: 'Perangkingan dengan Simple Additive Weighting.',
  },
  {
    icon: ScanSearch,
    title: 'Transparan',
    text: 'Hasil dapat dilihat dan diverifikasi per KK.',
  },
  {
    icon: BadgeCheck,
    title: 'Akurat',
    text: 'Menggunakan data dan kriteria yang terukur.',
  },
]

const YEAR = new Date().getFullYear()

export default function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (status === 'authenticated' && !submitting) return <Navigate to="/" replace />

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (error?.fields?.[field]) setError((err) => ({ ...err, fields: { ...err.fields, [field]: undefined } }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fields = {}
    if (!form.username.trim()) fields.username = 'Username wajib diisi'
    if (!form.password) fields.password = 'Password wajib diisi'
    if (Object.keys(fields).length) return setError({ message: null, fields })

    setSubmitting(true)
    setError(null)
    try {
      const user = await login(form.username.trim(), form.password)
      const from = location.state?.from?.pathname
      const target = from && isRolePath(user.role, from) ? from : ROLE_HOME[user.role]
      navigate(target, { replace: true, state: { welcome: true } })
    } catch (err) {
      setError({ message: err.message, fields: err.details ?? {} })
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-[44%] max-w-xl flex-col justify-between border-r border-border bg-sidebar p-10 text-sidebar-fg lg:flex xl:p-14">
        <Brand />

        <div>
          <p className="text-3xl leading-snug font-semibold xl:text-4xl">
            Bantuan sosial yang transparan, akurat, dan tepat sasaran.
          </p>
          <span className="mt-5 block h-1 w-14 rounded-full bg-primary" />

          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sidebar-fg">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-sidebar-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-sidebar-muted">Bersama untuk Kesejahteraan Masyarakat</p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <Brand />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-fg">Masuk</h1>
            <p className="mt-1 text-sm text-fg-muted">Silakan masuk menggunakan akun yang diberikan oleh desa.</p>

            {error?.message && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{error.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <Field
                id="username"
                label="Username"
                icon={User}
                error={error?.fields?.username}
                inputProps={{
                  type: 'text',
                  autoComplete: 'username',
                  autoCapitalize: 'none',
                  spellCheck: false,
                  placeholder: 'contoh: rt001.rw001',
                  value: form.username,
                  onChange: update('username'),
                  autoFocus: true,
                }}
              />

              <Field
                id="password"
                label="Password"
                icon={LockKeyhole}
                error={error?.fields?.password}
                inputProps={{
                  type: showPassword ? 'text' : 'password',
                  autoComplete: 'current-password',
                  placeholder: 'Masukkan password',
                  value: form.password,
                  onChange: update('password'),
                }}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="rounded p-1 text-fg-muted hover:text-fg focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:brightness-110 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
                {submitting ? 'Memproses…' : 'Masuk'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-fg-muted">
              Lupa password? Hubungi perangkat desa untuk mengatur ulang akun Anda.
            </p>
          </div>
        </div>

        <footer className="flex flex-col items-center gap-3 text-xs text-fg-muted sm:flex-row sm:justify-between">
          <ThemePicker />
          <span>© {YEAR} SPK Bansos · Kelompok C</span>
        </footer>
      </main>
    </div>
  )
}

function Field({ id, label, icon: Icon, error, inputProps, trailing }) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" aria-hidden />
        <input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-surface py-2.5 pl-10 text-sm text-fg placeholder:text-fg-muted/70 focus:ring-4 focus:outline-none ${
            trailing ? 'pr-10' : 'pr-3'
          } ${error ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
          {...inputProps}
        />
        {trailing && <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div>}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
