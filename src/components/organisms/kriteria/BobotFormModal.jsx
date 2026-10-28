import { api } from '../../../lib/api.js'
import { formatBobot, parseDecimal } from '../../../lib/format.js'
import { useForm } from '../../../lib/hooks.js'
import { TextField } from '../../molecules/FormField.jsx'
import FormModal from '../FormModal.jsx'

const fieldKey = (kriteria) => `k${kriteria.id}`

// Weights of all criteria at once, since only the full set can sum to 1,000 (API checks it too).
export default function BobotFormModal({ kriteria, onClose, onSaved }) {
  const form = useForm(Object.fromEntries(kriteria.map((k) => [fieldKey(k), formatBobot(k.bobot)])))

  // Thousandths avoid float error (0,1 + 0,2); NaN while a field is not a number yet
  const thousandths = kriteria.map((k) => Math.round(parseDecimal(form.values[fieldKey(k)]) * 1000))
  const total = thousandths.reduce((sum, n) => sum + n, 0)
  const totalValid = Number.isFinite(total)

  function validate(v) {
    const errors = {}
    for (const k of kriteria) {
      const value = parseDecimal(v[fieldKey(k)])
      if (!(value > 0 && value <= 1)) errors[fieldKey(k)] = 'Bobot berupa angka lebih dari 0 dan maksimal 1'
      else if (Math.abs(value * 1000 - Math.round(value * 1000)) > 1e-6) {
        errors[fieldKey(k)] = 'Maksimal 3 angka di belakang koma'
      }
    }
    if (!Object.keys(errors).length && total !== 1000) {
      errors[fieldKey(kriteria.at(-1))] = 'Total bobot harus 1,000'
    }
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const result = await api('/kriteria/bobot', {
        method: 'PUT',
        body: {
          bobot: kriteria.map((k) => ({
            id: k.id,
            bobot: parseDecimal(v[fieldKey(k)]),
          })),
        },
      })
      onSaved(result)
    }, validate)
  }

  return (
    <FormModal
      title="Atur Bobot Kriteria"
      description="Total bobot seluruh kriteria harus tepat 1,000. Gunakan koma atau titik sebagai pemisah desimal."
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <div className="space-y-3">
        {kriteria.map((k, index) => (
          <div key={k.id} className="grid grid-cols-[1fr_8rem] items-start gap-4">
            <div className="pt-2.5 text-sm">
              <span className="font-semibold">{k.kode}</span>
              <span className="ml-2 text-fg-muted">{k.nama}</span>
            </div>
            <TextField
              id={fieldKey(k)}
              label={<span className="sr-only">Bobot {k.kode}</span>}
              inputMode="decimal"
              autoFocus={index === 0}
              className="w-full text-right font-mono"
              {...form.field(fieldKey(k))}
            />
          </div>
        ))}
      </div>

      <TotalBar total={total} valid={totalValid} />
    </FormModal>
  )
}

function TotalBar({ total, valid }) {
  const ok = valid && total === 1000
  const selisih = valid ? (total - 1000) / 1000 : null

  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
        ok ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'
      }`}
      aria-live="polite"
    >
      <span className="font-medium">Total bobot (Σ w)</span>
      <span className="font-mono font-semibold">
        {valid ? formatBobot(total / 1000) : '–'}
        {valid && !ok && (
          <span className="ml-2 font-sans text-xs font-normal">
            ({selisih > 0 ? 'lebih' : 'kurang'} {formatBobot(Math.abs(selisih))})
          </span>
        )}
      </span>
    </div>
  )
}
