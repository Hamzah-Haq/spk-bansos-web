import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react'
import Button from '../../atoms/Button.jsx'
import Alert from '../../molecules/Alert.jsx'
import { TextField } from '../../molecules/FormField.jsx'

// Username/password form. onLogin(username, password) may throw an ApiError; its message and
// field details are shown here.
export default function LoginForm({ submitting, onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

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

    setError(null)
    try {
      await onLogin(form.username.trim(), form.password)
    } catch (err) {
      setError({ message: err.message, fields: err.details ?? {} })
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-fg">Masuk</h1>
      <p className="mt-1 text-sm text-fg-muted">Silakan masuk menggunakan akun yang diberikan oleh desa.</p>

      {error?.message && <Alert className="mt-6">{error.message}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <TextField
          id="username"
          label="Username"
          icon={User}
          error={error?.fields?.username}
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="contoh: rt001.rw001"
          value={form.username}
          onChange={update('username')}
          autoFocus
        />

        <TextField
          id="password"
          label="Password"
          icon={LockKeyhole}
          error={error?.fields?.password}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={update('password')}
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

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-fg-muted">
        Lupa password? Hubungi perangkat desa untuk mengatur ulang akun Anda.
      </p>
    </>
  )
}
