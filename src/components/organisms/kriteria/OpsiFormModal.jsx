import { Plus, Trash2 } from 'lucide-react'
import { api } from '../../../lib/api.js'
import { useForm } from '../../../lib/hooks.js'
import { MIN_OPSI, SIFAT } from '../../../lib/kriteria.js'
import Button from '../../atoms/Button.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import Input from '../../atoms/Input.jsx'
import Select from '../../atoms/Select.jsx'
import Alert from '../../molecules/Alert.jsx'
import FormModal from '../FormModal.jsx'

const MAX_OPSI = 10

const SKOR_OPTIONS = [5, 4, 3, 2, 1].map((skor) => ({
  value: String(skor),
  label: String(skor),
}))

function newRow() {
  return {
    key: crypto.randomUUID(),
    label: '',
    skor: '1',
  }
}

// Answer options of one question with their 1–5 scores. Saved as a whole list in this order.
// While the questionnaire is `locked`, only labels can change (no add/remove, scores fixed).
export default function OpsiFormModal({ pertanyaan, kriteria, locked, onClose, onSaved }) {
  const form = useForm({
    opsi: pertanyaan.opsi.length
      ? pertanyaan.opsi.map((o) => ({
          key: String(o.id),
          id: o.id,
          label: o.label,
          skor: String(o.skor),
        }))
      : [newRow(), newRow()],
  })
  const rows = form.values.opsi
  const { errors } = form

  function updateRow(index, patch) {
    form.setValues((v) => ({
      opsi: v.opsi.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }))
    form.setErrors((errs) => ({
      ...errs,
      opsi: undefined,
      [`opsi.${index}.label`]: undefined,
      [`opsi.${index}.skor`]: undefined,
    }))
  }

  function addRow() {
    form.setValues((v) => ({ opsi: [...v.opsi, newRow()] }))
  }

  function removeRow(index) {
    form.setValues((v) => ({ opsi: v.opsi.filter((_, i) => i !== index) }))
    // Row errors are keyed by position, so they no longer line up
    form.setErrors({})
  }

  function validate(v) {
    const result = {}
    if (v.opsi.length < MIN_OPSI) result.opsi = `Minimal ${MIN_OPSI} opsi jawaban`
    v.opsi.forEach((row, i) => {
      if (!row.label.trim()) result[`opsi.${i}.label`] = 'Label opsi wajib diisi'
    })
    const labels = v.opsi.map((row) => row.label.trim().toLowerCase())
    if (new Set(labels).size !== labels.length) result.opsi = 'Label opsi tidak boleh sama'
    return result
  }

  function save() {
    return form.submit(async (v) => {
      const { data } = await api(`/pertanyaan/${pertanyaan.id}/opsi`, {
        method: 'PUT',
        body: {
          opsi: v.opsi.map((row) => ({
            ...(row.id && { id: row.id }),
            label: row.label.trim(),
            skor: Number(row.skor),
          })),
        },
      })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={`Opsi Jawaban ${pertanyaan.kode}`}
      description={pertanyaan.teks}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      {locked ? (
        <Alert tone="warning">{locked}</Alert>
      ) : (
        <Alert tone="info">
          Skor 1–5 untuk setiap opsi; 5 = paling mendesak. {kriteria.kode} bersifat{' '}
          <strong>{SIFAT[kriteria.sifat].label.toLowerCase()}</strong> ({SIFAT[kriteria.sifat].rumus}):{' '}
          {SIFAT[kriteria.sifat].penjelasan.toLowerCase()}
        </Alert>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_5rem_2.25rem] gap-2 text-xs font-medium text-fg-muted">
          <span>Label opsi</span>
          <span>Skor</span>
        </div>
        {rows.map((row, index) => {
          const labelError = errors[`opsi.${index}.label`]
          const skorError = errors[`opsi.${index}.skor`]
          return (
            <div key={row.key}>
              <div className="grid grid-cols-[1fr_5rem_2.25rem] items-center gap-2">
                <Input
                  value={row.label}
                  onChange={(e) => updateRow(index, { label: e.target.value })}
                  invalid={Boolean(labelError)}
                  maxLength={200}
                  placeholder={`Opsi ${index + 1}`}
                  aria-label={`Label opsi ${index + 1}`}
                  autoFocus={index === 0}
                  className="w-full"
                />
                <Select
                  options={SKOR_OPTIONS}
                  value={row.skor}
                  onChange={(e) => updateRow(index, { skor: e.target.value })}
                  invalid={Boolean(skorError)}
                  disabled={Boolean(locked)}
                  aria-label={`Skor opsi ${index + 1}`}
                  className="w-full"
                />
                <IconButton
                  icon={Trash2}
                  label="Hapus opsi"
                  tone="danger"
                  disabled={Boolean(locked) || rows.length <= MIN_OPSI}
                  onClick={() => removeRow(index)}
                />
              </div>
              {(labelError || skorError) && <p className="mt-1 text-xs text-danger">{labelError ?? skorError}</p>}
            </div>
          )
        })}
      </div>

      {errors.opsi && <p className="text-xs text-danger">{errors.opsi}</p>}

      <Button
        size="sm"
        variant="secondary"
        icon={Plus}
        disabled={Boolean(locked) || rows.length >= MAX_OPSI}
        onClick={addRow}
      >
        Tambah Opsi
      </Button>
    </FormModal>
  )
}
