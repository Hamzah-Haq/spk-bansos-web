import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import Button from '../../atoms/Button.jsx'
import Alert from '../../molecules/Alert.jsx'
import Card from '../../molecules/Card.jsx'
import { TextField } from '../../molecules/FormField.jsx'
import { useToast } from '../Toast.jsx'

const EMPTY = {
  currentPassword: '',
  newPassword: '',
  confirm: '',
}

// Pengaturan section: change your own password (any role). Other devices are logged out.
export default function ChangePasswordCard() {
  const toast = useToast()
  const form = useForm(EMPTY)

  function validate(v) {
    const errors = {}
    if (!v.currentPassword) errors.currentPassword = 'Password lama wajib diisi'
    if (v.newPassword.length < 8) errors.newPassword = 'Password minimal 8 karakter'
    if (v.confirm !== v.newPassword) errors.confirm = 'Konfirmasi password tidak sama'
    return errors
  }

  function handleSubmit(e) {
    e.preventDefault()
    form.submit(async ({ currentPassword, newPassword }) => {
      await api('/auth/password', { method: 'PUT', body: { currentPassword, newPassword } })
      form.setValues(EMPTY)
      toast.success('Password berhasil diubah. Perangkat lain telah dikeluarkan.')
    }, validate)
  }

  return (
    <Card
      title="Ganti Password"
      description="Setelah diganti, akun Anda akan keluar dari perangkat lain."
    >
      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
        {form.error && <Alert>{form.error}</Alert>}
        <TextField
          id="currentPassword"
          label="Password lama"
          type="password"
          autoComplete="current-password"
          {...form.field('currentPassword')}
        />
        <TextField
          id="newPassword"
          label="Password baru"
          type="password"
          autoComplete="new-password"
          hint="Minimal 8 karakter."
          {...form.field('newPassword')}
        />
        <TextField
          id="confirm"
          label="Ulangi password baru"
          type="password"
          autoComplete="new-password"
          {...form.field('confirm')}
        />
        <Button type="submit" loading={form.submitting}>
          Simpan Password
        </Button>
      </form>
    </Card>
  )
}
