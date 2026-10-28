import { useState } from 'react'
import { Scale } from 'lucide-react'
import Button from '../components/atoms/Button.jsx'
import Alert from '../components/molecules/Alert.jsx'
import ConfirmDialog from '../components/organisms/ConfirmDialog.jsx'
import { useToast } from '../components/organisms/Toast.jsx'
import BobotFormModal from '../components/organisms/kriteria/BobotFormModal.jsx'
import KriteriaFormModal from '../components/organisms/kriteria/KriteriaFormModal.jsx'
import KriteriaTable from '../components/organisms/kriteria/KriteriaTable.jsx'
import KuesionerSection from '../components/organisms/kriteria/KuesionerSection.jsx'
import OpsiFormModal from '../components/organisms/kriteria/OpsiFormModal.jsx'
import PertanyaanFormModal from '../components/organisms/kriteria/PertanyaanFormModal.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { api } from '../lib/api.js'
import { useApiQuery } from '../lib/hooks.js'
import { MIN_OPSI } from '../lib/kriteria.js'

// Data Kriteria (desa): C1–C5 with sifat and bobot, and the questionnaire behind each criterion.
export default function KriteriaPage() {
  const toast = useToast()
  const query = useApiQuery('/kriteria')
  // { type: 'kriteria' | 'bobot' | 'pertanyaan' | 'opsi' | 'delete', kriteria?, pertanyaan? }
  const [dialog, setDialog] = useState(null)

  const kriteria = query.data?.data ?? []
  const locked = query.data?.meta.kuesionerTerkunci ?? null
  const tanpaOpsi = kriteria.flatMap((k) => k.pertanyaan).filter((p) => p.opsi.length < MIN_OPSI)

  function closeDialog() {
    setDialog(null)
  }

  function done(message) {
    toast.success(message)
    setDialog(null)
    query.reload()
  }

  async function deletePertanyaan(pertanyaan) {
    await api(`/pertanyaan/${pertanyaan.id}`, { method: 'DELETE' })
    done(`Pertanyaan ${pertanyaan.kode} berhasil dihapus`)
  }

  return (
    <PageTemplate
      title="Data Kriteria"
      description="Kriteria penilaian metode SAW beserta bobot dan kuesioner survei untuk setiap kriteria."
      actions={
        <Button
          icon={Scale}
          disabled={!kriteria.length}
          onClick={() => setDialog({ type: 'bobot' })}
        >
          Atur Bobot
        </Button>
      }
    >
      {locked && <Alert tone="warning">{locked}</Alert>}
      {tanpaOpsi.length > 0 && (
        <Alert tone="warning">
          {tanpaOpsi.length} pertanyaan ({tanpaOpsi.map((p) => p.kode).join(', ')}) belum memiliki minimal{' '}
          {MIN_OPSI} opsi jawaban. Survei belum dapat diisi sampai semua pertanyaan memiliki opsi dan skor.
        </Alert>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">Kriteria & Bobot</h2>
        <KriteriaTable
          query={query}
          onEdit={(k) => setDialog({ type: 'kriteria', kriteria: k })}
        />
      </section>

      {kriteria.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold">Kuesioner</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Setiap pertanyaan dijawab dengan memilih satu opsi; skor opsi (1–5) menjadi nilai pertanyaan tersebut.
            </p>
          </div>
          {kriteria.map((k) => (
            <KuesionerSection
              key={k.id}
              kriteria={k}
              locked={locked}
              onAdd={(kr) => setDialog({ type: 'pertanyaan', kriteria: kr })}
              onEdit={(p, kr) => setDialog({ type: 'pertanyaan', kriteria: kr, pertanyaan: p })}
              onEditOpsi={(p, kr) => setDialog({ type: 'opsi', kriteria: kr, pertanyaan: p })}
              onDelete={(p) => setDialog({ type: 'delete', pertanyaan: p })}
            />
          ))}
        </section>
      )}

      {dialog?.type === 'kriteria' && (
        <KriteriaFormModal
          kriteria={dialog.kriteria}
          onClose={closeDialog}
          onSaved={(saved) => done(`Kriteria ${saved.kode} berhasil diperbarui`)}
        />
      )}

      {dialog?.type === 'bobot' && (
        <BobotFormModal
          kriteria={kriteria}
          onClose={closeDialog}
          onSaved={() => done('Bobot kriteria berhasil disimpan')}
        />
      )}

      {dialog?.type === 'pertanyaan' && (
        <PertanyaanFormModal
          kriteria={dialog.kriteria}
          pertanyaan={dialog.pertanyaan}
          onClose={closeDialog}
          onSaved={(saved) =>
            done(`Pertanyaan ${saved.kode} berhasil ${dialog.pertanyaan ? 'diperbarui' : 'ditambahkan'}`)
          }
        />
      )}

      {dialog?.type === 'opsi' && (
        <OpsiFormModal
          kriteria={dialog.kriteria}
          pertanyaan={dialog.pertanyaan}
          locked={locked}
          onClose={closeDialog}
          onSaved={(saved) => done(`Opsi jawaban ${saved.kode} berhasil disimpan`)}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Pertanyaan"
          confirmLabel="Hapus"
          message={
            <>
              Hapus pertanyaan <strong className="text-fg">{dialog.pertanyaan.kode}</strong> beserta opsi
              jawabannya? Rumus konversi kriteria akan menyesuaikan jumlah pertanyaan yang tersisa.
            </>
          }
          onConfirm={() => deletePertanyaan(dialog.pertanyaan)}
          onClose={closeDialog}
        />
      )}
    </PageTemplate>
  )
}
