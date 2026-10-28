import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { TextAreaField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

const DECISIONS = {
  verified: {
    title: 'Verifikasi Survei',
    submitLabel: 'Verifikasi',
    variant: 'primary',
    text: 'Data survei sudah sesuai dan akan diikutkan dalam perhitungan SAW periode ini.',
    catatanLabel: 'Catatan (opsional)',
    catatanHint: 'Terlihat oleh Ketua RT.',
  },
  rejected: {
    title: 'Kembalikan untuk Revisi',
    submitLabel: 'Kembalikan',
    variant: 'danger',
    text: 'Survei dikembalikan ke Ketua RT untuk diperbaiki lalu dikirim ulang.',
    catatanLabel: 'Catatan perbaikan',
    catatanHint: 'Wajib diisi. Jelaskan bagian yang perlu diperbaiki, misalnya jawaban atau foto yang kurang sesuai.',
  },
}

// decision = 'verified' | 'rejected'
export default function VerifikasiFormModal({ survei, decision, onClose, onSaved }) {
  const config = DECISIONS[decision]
  const form = useForm({ catatan: '' })

  function validate(v) {
    return decision === 'rejected' && !v.catatan.trim() ? { catatan: 'Catatan wajib diisi' } : {}
  }

  function save() {
    return form.submit(async (v) => {
      const catatan = v.catatan.trim()
      const { data } = await api(`/survei/${survei.id}/verifikasi`, {
        method: 'POST',
        body: {
          status: decision,
          ...(catatan && { catatan }),
        },
      })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={config.title}
      description={`${survei.kk.kepalaKeluarga} · No. KK ${survei.kk.noKk}`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      submitLabel={config.submitLabel}
      submitVariant={config.variant}
      error={form.error}
    >
      <p className="text-sm text-fg-muted">{config.text}</p>
      <TextAreaField
        id="catatan"
        label={config.catatanLabel}
        hint={config.catatanHint}
        maxLength={1000}
        rows={4}
        autoFocus
        {...form.field('catatan')}
      />
    </FormModal>
  )
}
