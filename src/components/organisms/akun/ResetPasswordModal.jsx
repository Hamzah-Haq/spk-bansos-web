import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

export default function ResetPasswordModal({ user, onClose, onSaved }) {
  const form = useForm({
    password: '',
    confirm: '',
  })

  function validate(v) {
    const errors = {}
    if (v.password.length < 8) errors.password = 'Password minimal 8 karakter'
    if (v.confirm !== v.password) errors.confirm = 'Konfirmasi password tidak sama'
    return errors
  }

  function save() {
    return form.submit(async ({ password }) => {
      await api(`/users/${user.id}/password`, { method: 'PUT', body: { password } })
      onSaved()
    }, validate)
  }

  return (
    <FormModal
      title="Atur Ulang Password"
      description={`${user.nama} (${user.username})`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      submitLabel="Atur Ulang"
      error={form.error}
    >
      <p className="text-sm text-fg-muted">Pengguna akan keluar dari semua perangkat dan harus masuk dengan password baru.</p>
      <TextField
        id="password"
        label="Password baru"
        type="password"
        autoComplete="new-password"
        autoFocus
        {...form.field('password')}
      />
      <TextField
        id="confirm"
        label="Ulangi password baru"
        type="password"
        autoComplete="new-password"
        {...form.field('confirm')}
      />
    </FormModal>
  )
}
