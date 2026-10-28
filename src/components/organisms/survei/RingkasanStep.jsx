import { CircleAlert, CircleCheck, Send } from 'lucide-react'
import { JENIS_FOTO } from '../../../lib/survei.js'
import Button from '../../atoms/Button.jsx'
import Alert from '../../molecules/Alert.jsx'

// Last step: what is complete, what is missing, and the submit button.
export default function RingkasanStep({ kriteria, answers, survei, readOnly, onSubmit }) {
  const missing = kriteria.flatMap((k) => k.pertanyaan).filter((p) => !answers[p.id])

  return (
    <div className="space-y-5">
      <ul className="divide-y divide-border rounded-xl border border-border">
        {kriteria.map((k) => {
          const answered = k.pertanyaan.filter((p) => answers[p.id]).length
          const complete = answered === k.pertanyaan.length
          return (
            <li key={k.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              {complete ? (
                <CircleCheck className="size-5 shrink-0 text-success" aria-hidden />
              ) : (
                <CircleAlert className="size-5 shrink-0 text-warning" aria-hidden />
              )}
              <span className="flex-1">
                <span className="font-semibold">{k.kode}</span> · {k.nama}
              </span>
              <span className="text-fg-muted">
                {answered}/{k.pertanyaan.length} dijawab
              </span>
            </li>
          )
        })}
        <li className="flex items-center gap-3 px-4 py-3 text-sm">
          <CircleCheck
            className={`size-5 shrink-0 ${survei.foto.length ? 'text-success' : 'text-fg-muted'}`}
            aria-hidden
          />
          <span className="flex-1 font-semibold">Foto lapangan</span>
          <span className="text-fg-muted">
            {survei.foto.length}/{JENIS_FOTO.length} foto
          </span>
        </li>
      </ul>

      {missing.length > 0 && (
        <Alert tone="warning">
          Pertanyaan yang belum dijawab: {missing.map((p) => p.kode).join(', ')}. Semua pertanyaan wajib dijawab
          sebelum survei dikirim.
        </Alert>
      )}

      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-alt p-4">
          <p className="text-sm text-fg-muted">
            Setelah dikirim, survei tidak dapat diubah kecuali dikembalikan oleh perangkat desa untuk direvisi.
          </p>
          <Button
            icon={Send}
            disabled={missing.length > 0}
            onClick={onSubmit}
          >
            Kirim untuk Verifikasi
          </Button>
        </div>
      )}
    </div>
  )
}
