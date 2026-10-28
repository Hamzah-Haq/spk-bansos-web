import { formatAngka } from '../../../lib/format.js'
import { nilaiKriteria } from '../../../lib/kriteria.js'
import Badge from '../../atoms/Badge.jsx'
import Card from '../../molecules/Card.jsx'

// For the verifier: every answer with its score, and each criterion's value X as the SAW will use it
// (average of its questions, proposal Tabel 2.1). Scores come from jawaban.skor, i.e. as answered.
export default function JawabanReview({ kriteria, jawaban }) {
  const byPertanyaan = Object.fromEntries(jawaban.map((j) => [j.pertanyaanId, j]))
  const skorByPertanyaan = Object.fromEntries(jawaban.map((j) => [j.pertanyaanId, j.skor]))

  return (
    <div className="space-y-4">
      {kriteria.map((k) => {
        const { nilai, rumus } = nilaiKriteria(k, skorByPertanyaan)
        return (
          <Card
            key={k.id}
            title={`${k.kode} · ${k.nama}`}
            description={rumus ? `${rumus} = ${formatAngka(nilai)}` : 'Belum semua pertanyaan dijawab'}
            actions={
              nilai == null ? (
                <Badge tone="warning">Belum lengkap</Badge>
              ) : (
                <Badge tone="primary">Nilai {formatAngka(nilai)}</Badge>
              )
            }
          >
            <ul className="divide-y divide-border">
              {k.pertanyaan.map((p) => {
                const j = byPertanyaan[p.id]
                const opsi = j && p.opsi.find((o) => o.id === j.opsiId)
                return (
                  <li key={p.id} className="flex items-start gap-4 py-3 text-sm first:pt-0 last:pb-0">
                    <span className="w-8 shrink-0 font-mono font-semibold text-primary">{p.kode}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-fg-muted">{p.teks}</p>
                      <p className="mt-1 font-medium">
                        {j ? (opsi?.label ?? '(opsi sudah dihapus)') : <span className="text-warning">Belum dijawab</span>}
                      </p>
                    </div>
                    {j && (
                      <span
                        className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-semibold text-primary"
                        title="Skor jawaban (1–5)"
                      >
                        {j.skor}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}
