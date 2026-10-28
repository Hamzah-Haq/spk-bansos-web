import { useAuth } from '../../../auth/AuthProvider.jsx'
import { api } from '../../../lib/api.js'
import { formatRt } from '../../../lib/format.js'
import { useApiQuery, useForm } from '../../../lib/hooks.js'
import { SelectField, TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

// Create (kk = undefined) or edit a Kartu Keluarga. Desa picks the RT; an RT account always
// registers into its own RT (the API enforces this too).
export default function KkFormModal({ kk, onClose, onSaved }) {
  const { user } = useAuth()
  const isDesa = user.role === 'desa'
  const editing = Boolean(kk)

  const form = useForm({
    noKk: kk?.noKk ?? '',
    kepalaKeluarga: kk?.kepalaKeluarga ?? '',
    alamat: kk?.alamat ?? '',
    jumlahAnggota: kk ? String(kk.jumlahAnggota) : '',
    rtId: kk?.rt.id ? String(kk.rt.id) : '',
  })

  function validate(v) {
    const errors = {}
    const jumlah = Number(v.jumlahAnggota)
    if (!/^\d{16}$/.test(v.noKk.trim())) errors.noKk = 'No. KK harus 16 digit angka'
    if (!v.kepalaKeluarga.trim()) errors.kepalaKeluarga = 'Nama kepala keluarga wajib diisi'
    if (!v.alamat.trim()) errors.alamat = 'Alamat wajib diisi'
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 50) {
      errors.jumlahAnggota = 'Jumlah anggota keluarga 1–50 orang'
    }
    if (isDesa && !v.rtId) errors.rtId = 'Wilayah RT wajib dipilih'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        noKk: v.noKk.trim(),
        kepalaKeluarga: v.kepalaKeluarga.trim(),
        alamat: v.alamat.trim(),
        jumlahAnggota: Number(v.jumlahAnggota),
        ...(isDesa && { rtId: Number(v.rtId) }),
      }
      const { data } = editing
        ? await api(`/kk/${kk.id}`, { method: 'PATCH', body })
        : await api('/kk', { method: 'POST', body })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={editing ? 'Ubah Data KK' : 'Tambah Data KK'}
      description={editing ? `No. KK ${kk.noKk}` : isDesa ? undefined : `KK akan terdaftar di ${formatRt(user.rt)}.`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="noKk"
        label="No. Kartu Keluarga"
        placeholder="16 digit angka"
        inputMode="numeric"
        maxLength={16}
        autoComplete="off"
        autoFocus
        hint="Satu No. KK hanya dapat terdaftar satu kali."
        {...form.field('noKk')}
      />
      <TextField
        id="kepalaKeluarga"
        label="Nama kepala keluarga"
        placeholder="Sesuai Kartu Keluarga"
        {...form.field('kepalaKeluarga')}
      />
      <TextField
        id="alamat"
        label="Alamat"
        placeholder="contoh: Jl. Melati No. 3"
        {...form.field('alamat')}
      />
      <TextField
        id="jumlahAnggota"
        label="Jumlah anggota keluarga"
        type="number"
        min={1}
        max={50}
        {...form.field('jumlahAnggota')}
      />
      {isDesa && <RtField {...form.field('rtId')} />}
    </FormModal>
  )
}

// Only Perangkat Desa may read /rt, so this lives in its own component rendered for desa only.
function RtField(fieldProps) {
  const rtQuery = useApiQuery('/rt')
  const options = (rtQuery.data?.data ?? []).map((rt) => ({
    value: String(rt.id),
    label: formatRt(rt),
  }))

  return (
    <SelectField
      id="rtId"
      label="Wilayah RT"
      options={options}
      placeholder={rtQuery.loading ? 'Memuat…' : 'Pilih wilayah RT'}
      hint={rtQuery.data?.data.length === 0 ? 'Belum ada wilayah RT. Tambahkan di menu Manajemen Akun.' : undefined}
      {...fieldProps}
    />
  )
}
