import { ListChecks, Pencil, Plus, Trash2 } from 'lucide-react'
import { MIN_OPSI, rumusKonversi } from '../../../lib/kriteria.js'
import Badge from '../../atoms/Badge.jsx'
import Button from '../../atoms/Button.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import Card from '../../molecules/Card.jsx'

// Questionnaire of one criterion: its questions with their answer options and scores.
// `locked` = kuesioner structure frozen (see API kuesionerTerkunci): no add/delete.
export default function KuesionerSection({ kriteria, locked, onAdd, onEdit, onEditOpsi, onDelete }) {
  const single = kriteria.pertanyaan.length <= 1

  return (
    <Card
      title={`${kriteria.kode} · ${kriteria.nama}`}
      description={`Nilai kriteria = rata-rata skor pertanyaan: ${rumusKonversi(kriteria)}`}
      actions={
        <Button
          size="sm"
          variant="secondary"
          icon={Plus}
          disabled={Boolean(locked)}
          title={locked ?? undefined}
          onClick={() => onAdd(kriteria)}
        >
          Tambah Pertanyaan
        </Button>
      }
    >
      <ul className="divide-y divide-border">
        {kriteria.pertanyaan.map((p) => (
          <li key={p.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span className="mt-0.5 w-8 shrink-0 font-mono text-sm font-semibold text-primary">{p.kode}</span>

            <div className="min-w-0 flex-1">
              <p className="text-sm">{p.teks}</p>
              <OpsiList opsi={p.opsi} />
            </div>

            <div className="flex shrink-0 gap-1">
              <IconButton
                icon={Pencil}
                label="Ubah pertanyaan"
                tone="primary"
                onClick={() => onEdit(p, kriteria)}
              />
              <IconButton
                icon={ListChecks}
                label="Atur opsi jawaban dan skor"
                tone="success"
                onClick={() => onEditOpsi(p, kriteria)}
              />
              <IconButton
                icon={Trash2}
                label={deleteLabel({ locked, single, answered: p.jumlahJawaban > 0 })}
                tone="danger"
                disabled={Boolean(locked) || single || p.jumlahJawaban > 0}
                onClick={() => onDelete(p)}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function OpsiList({ opsi }) {
  if (opsi.length < MIN_OPSI) {
    return (
      <p className="mt-2">
        <Badge tone="warning">
          {opsi.length === 0 ? 'Belum ada opsi jawaban' : `Baru ${opsi.length} opsi, minimal ${MIN_OPSI}`}
        </Badge>
      </p>
    )
  }

  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Opsi jawaban">
      {opsi.map((o) => (
        <li
          key={o.id}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-alt px-2 py-0.5 text-xs"
        >
          <span>{o.label}</span>
          <span className="font-mono font-semibold text-primary">{o.skor}</span>
        </li>
      ))}
    </ul>
  )
}

function deleteLabel({ locked, single, answered }) {
  if (locked) return 'Kuesioner terkunci'
  if (answered) return 'Pertanyaan sudah dijawab pada survei'
  if (single) return 'Setiap kriteria minimal memiliki satu pertanyaan'
  return 'Hapus pertanyaan'
}
