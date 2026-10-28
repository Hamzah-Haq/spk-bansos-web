import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

// Create (rt = undefined) or edit a wilayah RT.
export default function RtFormModal({ rt, onClose, onSaved }) {
  const form = useForm({
    noRt: rt?.noRt ?? '',
    noRw: rt?.noRw ?? '',
  })

  function validate(v) {
    const errors = {}
    if (!/^\d{1,3}$/.test(v.noRt.trim())) errors.noRt = 'No. RT berupa 1–3 digit angka'
    if (!/^\d{1,3}$/.test(v.noRw.trim())) errors.noRw = 'No. RW berupa 1–3 digit angka'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        noRt: v.noRt.trim(),
        noRw: v.noRw.trim(),
      }
      const { data } = rt
        ? await api(`/rt/${rt.id}`, { method: 'PATCH', body })
        : await api('/rt', { method: 'POST', body })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={rt ? 'Ubah Wilayah RT' : 'Tambah Wilayah RT'}
      description="Nomor otomatis disimpan 3 digit, misalnya 4 menjadi 004."
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="noRt"
          label="No. RT"
          inputMode="numeric"
          maxLength={3}
          placeholder="001"
          autoFocus
          {...form.field('noRt')}
        />
        <TextField
          id="noRw"
          label="No. RW"
          inputMode="numeric"
          maxLength={3}
          placeholder="001"
          {...form.field('noRw')}
        />
      </div>
    </FormModal>
  )
}
