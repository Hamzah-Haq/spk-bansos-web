import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../../auth/roles.js'
import { api } from '../../../lib/api.js'
import { formatRt } from '../../../lib/format.js'
import { useApiQuery, useForm } from '../../../lib/hooks.js'
import Alert from '../../molecules/Alert.jsx'
import { SelectField, TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

// Create (user = undefined) or edit an account. The password is only set here on create;
// afterwards it goes through ResetPasswordModal.
export default function UserFormModal({ user, isSelf, onClose, onSaved }) {
  const { refreshUser } = useAuth()
  const editing = Boolean(user)
  const rtQuery = useApiQuery('/rt')

  const form = useForm({
    nama: user?.nama ?? '',
    username: user?.username ?? '',
    role: user?.role ?? 'rt',
    rtId: user?.rt?.id ? String(user.rt.id) : '',
    password: '',
  })
  const { values } = form

  const rtOptions = (rtQuery.data?.data ?? []).map((rt) => ({
    value: String(rt.id),
    label: formatRt(rt),
  }))

  function validate(v) {
    const errors = {}
    if (!v.nama.trim()) errors.nama = 'Nama wajib diisi'
    if (!v.username.trim()) errors.username = 'Username wajib diisi'
    if (v.role === 'rt' && !v.rtId) errors.rtId = 'Wilayah RT wajib dipilih untuk akun Ketua RT/RW'
    if (!editing && v.password.length < 8) errors.password = 'Password minimal 8 karakter'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        nama: v.nama.trim(),
        username: v.username.trim(),
        role: v.role,
        rtId: v.role === 'rt' ? Number(v.rtId) : null,
        ...(!editing && { password: v.password }),
      }
      const { data } = editing
        ? await api(`/users/${user.id}`, { method: 'PATCH', body })
        : await api('/users', { method: 'POST', body })
      // Header and dashboard show the logged-in user's nama/username
      if (isSelf) await refreshUser()
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={editing ? 'Ubah Akun' : 'Tambah Akun'}
      description={editing ? user.username : 'Akun baru langsung aktif dan dapat digunakan untuk masuk.'}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="nama"
        label="Nama lengkap"
        placeholder="contoh: Ketua RT 004 / RW 001 - Budi"
        autoFocus
        {...form.field('nama')}
      />
      <TextField
        id="username"
        label="Username"
        placeholder="contoh: rt004.rw001"
        hint="Huruf kecil, angka, titik, garis bawah, atau strip (3–50 karakter)."
        autoCapitalize="none"
        spellCheck={false}
        {...form.field('username')}
      />
      <SelectField
        id="role"
        label="Jabatan"
        options={ROLE_OPTIONS}
        disabled={isSelf}
        hint={isSelf ? 'Jabatan akun Anda sendiri tidak dapat diubah.' : undefined}
        {...form.field('role')}
      />
      {values.role === 'rt' && (
        <SelectField
          id="rtId"
          label="Wilayah RT"
          options={rtOptions}
          placeholder={rtQuery.loading ? 'Memuat…' : 'Pilih wilayah RT'}
          hint="Ketua RT/RW hanya dapat melihat dan mengelola KK di wilayah ini."
          {...form.field('rtId')}
        />
      )}
      {values.role === 'rt' && rtQuery.data?.data.length === 0 && (
        <Alert tone="info">Belum ada wilayah RT. Tambahkan terlebih dahulu di tab Wilayah RT.</Alert>
      )}
      {!editing && (
        <TextField
          id="password"
          label="Password awal"
          type="password"
          autoComplete="new-password"
          hint="Minimal 8 karakter. Sampaikan kepada pemilik akun dan minta diganti setelah masuk."
          {...form.field('password')}
        />
      )}
    </FormModal>
  )
}
