import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { api } from '../../../lib/api.js'
import Button from '../../atoms/Button.jsx'
import Alert from '../../molecules/Alert.jsx'
import Stepper from '../../molecules/Stepper.jsx'
import ConfirmDialog from '../ConfirmDialog.jsx'
import { useToast } from '../Toast.jsx'
import FotoStep from './FotoStep.jsx'
import PertanyaanStep from './PertanyaanStep.jsx'
import RingkasanStep from './RingkasanStep.jsx'

// { [pertanyaanId]: opsiId } from the API's jawaban[]
function toAnswerMap(jawaban) {
  return Object.fromEntries(jawaban.map((j) => [j.pertanyaanId, j.opsiId]))
}

function isComplete(kriteria, answers) {
  return kriteria.pertanyaan.every((p) => answers[p.id])
}

// Questionnaire form: one step per criterion (C1…C5), then photos, then submit. Changed answers
// are saved as a draft whenever the RT moves to another step, or with "Simpan Draf".
// Render with key={survei.id}: the answer state is initialised from `survei` once.
export default function SurveiWizard({ survei, kriteria, onChanged, onSubmitted }) {
  const toast = useToast()
  const readOnly = !survei.dapatDiubah

  const [answers, setAnswers] = useState(() => toAnswerMap(survei.jawaban))
  const [saved, setSaved] = useState(() => toAnswerMap(survei.jawaban))
  // Open on the first criterion that still has unanswered questions
  const [step, setStep] = useState(() => {
    const initial = toAnswerMap(survei.jawaban)
    const index = kriteria.findIndex((k) => !isComplete(k, initial))
    return readOnly || index === -1 ? 0 : index
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  const changed = Object.entries(answers).filter(([pertanyaanId, opsiId]) => saved[pertanyaanId] !== opsiId)
  const dirty = !readOnly && changed.length > 0

  // Leaving the page with unsaved answers asks the browser for confirmation
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const steps = [
    ...kriteria.map((k) => ({
      key: k.kode,
      label: k.kode,
      title: k.nama,
      done: isComplete(k, answers),
    })),
    {
      key: 'foto',
      label: 'Foto',
      title: 'Foto lapangan',
      done: survei.foto.length > 0,
    },
    {
      key: 'kirim',
      label: 'Kirim',
      title: 'Ringkasan dan kirim',
      done: !['draft', 'rejected'].includes(survei.status),
    },
  ]
  const current = steps[step]
  const currentKriteria = kriteria[step]

  // Throws on failure (used by the submit confirmation, which shows the message)
  async function persist() {
    if (!dirty) return
    const { data } = await api(`/survei/${survei.id}/jawaban`, {
      method: 'PUT',
      body: {
        jawaban: changed.map(([pertanyaanId, opsiId]) => ({
          pertanyaanId: Number(pertanyaanId),
          opsiId,
        })),
      },
    })
    setSaved(toAnswerMap(data.jawaban))
  }

  async function saveDraft({ notify = false } = {}) {
    setSaving(true)
    setError(null)
    try {
      const hadChanges = dirty
      await persist()
      if (notify) toast.success(hadChanges ? 'Draf survei tersimpan' : 'Tidak ada perubahan untuk disimpan')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function goTo(index) {
    if (index === step) return
    if (await saveDraft()) {
      setStep(index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function submit() {
    await persist()
    await api(`/survei/${survei.id}/submit`, { method: 'POST' })
    toast.success('Survei berhasil dikirim untuk diverifikasi')
    onSubmitted()
  }

  return (
    <section className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-sm">
      <Stepper
        steps={steps}
        current={step}
        onSelect={goTo}
        disabled={saving}
      />

      <div className="border-t border-border pt-5">
        <h2 className="mb-4 font-semibold">
          {currentKriteria ? `${currentKriteria.kode} · ${currentKriteria.nama}` : current.title}
        </h2>
        {error && <Alert className="mb-4">{error}</Alert>}

        {currentKriteria && (
          <PertanyaanStep
            kriteria={currentKriteria}
            answers={answers}
            readOnly={readOnly}
            onAnswer={(pertanyaanId, opsiId) => setAnswers((a) => ({ ...a, [pertanyaanId]: opsiId }))}
          />
        )}
        {current.key === 'foto' && (
          <FotoStep
            survei={survei}
            readOnly={readOnly}
            onChanged={onChanged}
          />
        )}
        {current.key === 'kirim' && (
          <RingkasanStep
            kriteria={kriteria}
            answers={answers}
            survei={survei}
            readOnly={readOnly}
            onSubmit={() => setConfirmSubmit(true)}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <Button
          variant="secondary"
          icon={ChevronLeft}
          disabled={step === 0 || saving}
          onClick={() => goTo(step - 1)}
        >
          Sebelumnya
        </Button>
        <div className="flex gap-3">
          {!readOnly && (
            <Button
              variant="secondary"
              icon={Save}
              loading={saving}
              onClick={() => saveDraft({ notify: true })}
            >
              Simpan Draf
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button disabled={saving} onClick={() => goTo(step + 1)}>
              Berikutnya
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>

      {confirmSubmit && (
        <ConfirmDialog
          title="Kirim Survei"
          tone="primary"
          confirmLabel="Kirim"
          message={
            <>
              Kirim survei <strong className="text-fg">{survei.kk.kepalaKeluarga}</strong> untuk diverifikasi
              perangkat desa? Jawaban tidak dapat diubah lagi kecuali survei dikembalikan untuk direvisi.
            </>
          }
          onConfirm={submit}
          onClose={() => setConfirmSubmit(false)}
        />
      )}
    </section>
  )
}
