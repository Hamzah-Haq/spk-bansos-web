import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { TextAreaField, TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

// Create a question under `kriteria` (pertanyaan = undefined) or edit one's code and text.
export default function PertanyaanFormModal({ kriteria, pertanyaan, onClose, onSaved }) {
  const form = useForm({
    kode: pertanyaan?.kode ?? '',
    teks: pertanyaan?.teks ?? '',
  })

  function validate(v) {
    const errors = {}
    if (!/^\d{1,2}[a-zA-Z]?$/.test(v.kode.trim())) {
      errors.kode = 'Kode berupa nomor dengan huruf opsional, misalnya 1, 2a, atau 4c'
    }
    if (!v.teks.trim()) errors.teks = 'Teks pertanyaan wajib diisi'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        kode: v.kode.trim().toLowerCase(),
        teks: v.teks.trim(),
      }
      const { data } = pertanyaan
        ? await api(`/pertanyaan/${pertanyaan.id}`, { method: 'PATCH', body })
        : await api('/pertanyaan', { method: 'POST', body: { ...body, kriteriaId: kriteria.id } })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={pertanyaan ? `Ubah Pertanyaan ${pertanyaan.kode}` : 'Tambah Pertanyaan'}
      description={`${kriteria.kode} · ${kriteria.nama}`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="kode"
        label="Kode"
        placeholder="contoh: 2c"
        maxLength={3}
        autoCapitalize="none"
        hint="Nomor pertanyaan pada kuesioner, mengikuti Tabel 2.1 proposal."
        autoFocus={!pertanyaan}
        {...form.field('kode')}
      />
      <TextAreaField
        id="teks"
        label="Teks pertanyaan"
        maxLength={500}
        autoFocus={Boolean(pertanyaan)}
        {...form.field('teks')}
      />
      {!pertanyaan && (
        <p className="text-xs text-fg-muted">
          Setelah disimpan, atur opsi jawaban dan skornya agar pertanyaan dapat diisi pada survei.
        </p>
      )}
    </FormModal>
  )
}
