import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

const CURRENT_YEAR = new Date().getFullYear()

// Create (periode = undefined) or edit a periode bansos.
export default function PeriodeFormModal({ periode, onClose, onSaved }) {
  const form = useForm({
    nama: periode?.nama ?? '',
    tahun: String(periode?.tahun ?? CURRENT_YEAR),
    kuota: periode ? String(periode.kuota) : '',
  })

  function validate(v) {
    const errors = {}
    if (!v.nama.trim()) errors.nama = 'Nama periode wajib diisi'
    if (!/^\d{4}$/.test(v.tahun)) errors.tahun = 'Tahun berupa 4 digit angka'
    if (!/^\d+$/.test(v.kuota) || Number(v.kuota) < 1) errors.kuota = 'Kuota minimal 1 KK'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        nama: v.nama.trim(),
        tahun: Number(v.tahun),
        kuota: Number(v.kuota),
      }
      const { data } = periode
        ? await api(`/periode/${periode.id}`, { method: 'PATCH', body })
        : await api('/periode', { method: 'POST', body })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={periode ? 'Ubah Periode' : 'Tambah Periode'}
      description={periode ? undefined : 'Periode baru langsung berstatus Dibuka.'}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="nama"
        label="Nama periode"
        placeholder="contoh: BLT Dana Desa Tahap 1"
        autoFocus
        {...form.field('nama')}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="tahun"
          label="Tahun"
          inputMode="numeric"
          maxLength={4}
          {...form.field('tahun')}
        />
        <TextField
          id="kuota"
          label="Kuota penerima (KK)"
          inputMode="numeric"
          hint="Peringkat 1 sampai kuota dinyatakan layak."
          {...form.field('kuota')}
        />
      </div>
    </FormModal>
  )
}
