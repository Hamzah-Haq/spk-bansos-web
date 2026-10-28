import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { SIFAT, SIFAT_OPTIONS } from '../../../lib/kriteria.js'
import Alert from '../../molecules/Alert.jsx'
import { SelectField, TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

// Edit a criterion's nama and sifat. The set C1–C5 itself is fixed by the proposal.
export default function KriteriaFormModal({ kriteria, onClose, onSaved }) {
  const form = useForm({
    nama: kriteria.nama,
    sifat: kriteria.sifat,
  })
  const { values } = form

  function validate(v) {
    return v.nama.trim() ? {} : { nama: 'Nama kriteria wajib diisi' }
  }

  function save() {
    return form.submit(async (v) => {
      const { data } = await api(`/kriteria/${kriteria.id}`, {
        method: 'PATCH',
        body: {
          nama: v.nama.trim(),
          sifat: v.sifat,
        },
      })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={`Ubah Kriteria ${kriteria.kode}`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="nama"
        label="Nama kriteria"
        autoFocus
        {...form.field('nama')}
      />
      <SelectField
        id="sifat"
        label="Sifat"
        options={SIFAT_OPTIONS}
        hint={`${SIFAT[values.sifat].rumus}. ${SIFAT[values.sifat].penjelasan}`}
        {...form.field('sifat')}
      />
      {values.sifat !== kriteria.sifat && (
        <Alert tone="warning">
          Sifat menentukan arah normalisasi SAW. Pastikan sesuai dengan arah skor opsi jawaban (skor 5 = paling
          mendesak); bila tidak, urutan perangkingan akan terbalik untuk kriteria ini.
        </Alert>
      )}
    </FormModal>
  )
}
