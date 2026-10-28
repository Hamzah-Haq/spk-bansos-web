import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME } from '../auth/roles.js'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'
import IconButton from '../components/atoms/IconButton.jsx'
import Input from '../components/atoms/Input.jsx'
import Select from '../components/atoms/Select.jsx'
import Alert from '../components/molecules/Alert.jsx'
import Pagination from '../components/molecules/Pagination.jsx'
import ConfirmDialog from '../components/organisms/ConfirmDialog.jsx'
import DataTable from '../components/organisms/DataTable.jsx'
import { useToast } from '../components/organisms/Toast.jsx'
import MulaiSurveiModal from '../components/organisms/survei/MulaiSurveiModal.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { api, withQuery } from '../lib/api.js'
import { formatRt, formatTanggal } from '../lib/format.js'
import { useApiQuery, useDebouncedValue } from '../lib/hooks.js'
import { JENIS_FOTO, STATUS_SURVEI, STATUS_SURVEI_OPTIONS } from '../lib/survei.js'

const PAGE_SIZE = 10

// Survei (rt): surveys of the RT's own KK per periode; start a new one in the open periode.
export default function SurveiPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const periodeQuery = useApiQuery('/periode')
  const periodeList = periodeQuery.data?.data ?? []
  const [filters, setFilters] = useState({
    periodeId: '',
    status: '',
    q: '',
  })
  const [page, setPage] = useState(1)
  // { type: 'create' | 'delete', survei? }
  const [dialog, setDialog] = useState(null)

  // Default: the open periode, else the newest one
  const periode = filters.periodeId
    ? periodeList.find((p) => String(p.id) === filters.periodeId)
    : (periodeList.find((p) => p.status === 'open') ?? periodeList[0])

  const q = useDebouncedValue(filters.q.trim())
  const query = useApiQuery(
    periode
      ? withQuery('/survei', {
          periodeId: periode.id,
          status: filters.status,
          q,
          page,
          limit: PAGE_SIZE,
        })
      : null,
  )

  function setFilter(name) {
    return (e) => {
      setFilters((f) => ({ ...f, [name]: e.target.value }))
      setPage(1)
    }
  }

  function open(survei) {
    navigate(`${ROLE_HOME.rt}/survei/${survei.id}`)
  }

  async function deleteSurvei(survei) {
    await api(`/survei/${survei.id}`, { method: 'DELETE' })
    if (query.data?.data.length === 1 && page > 1) setPage(page - 1)
    toast.success(`Survei ${survei.kk.kepalaKeluarga} berhasil dihapus`)
    setDialog(null)
    query.reload()
  }

  const columns = [
    {
      key: 'kk',
      header: 'Kepala Keluarga',
      render: (s) => (
        <div>
          <p className="font-medium">{s.kk.kepalaKeluarga}</p>
          <p className="font-mono text-xs text-fg-muted">{s.kk.noKk}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <Badge tone={STATUS_SURVEI[s.status].tone}>{STATUS_SURVEI[s.status].label}</Badge>,
    },
    {
      key: 'jawaban',
      header: 'Jawaban',
      className: 'text-right whitespace-nowrap',
      render: (s) => `${s.jumlahJawaban}/${s.totalPertanyaan}`,
    },
    {
      key: 'foto',
      header: 'Foto',
      className: 'text-right whitespace-nowrap',
      render: (s) => `${s.jumlahFoto}/${JENIS_FOTO.length}`,
    },
    {
      key: 'updatedAt',
      header: 'Diperbarui',
      className: 'whitespace-nowrap text-fg-muted',
      render: (s) => formatTanggal(s.updatedAt),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (s) => (
        <div className="flex justify-end gap-1">
          <IconButton
            icon={s.dapatDiubah ? Pencil : Eye}
            label={s.dapatDiubah ? (s.status === 'rejected' ? 'Revisi survei' : 'Isi survei') : 'Lihat survei'}
            tone="primary"
            onClick={() => open(s)}
          />
          {s.dapatDiubah && s.status === 'draft' && !s.submittedAt && (
            <IconButton
              icon={Trash2}
              label="Hapus draf survei"
              tone="danger"
              onClick={() => setDialog({ type: 'delete', survei: s })}
            />
          )}
        </div>
      ),
    },
  ]

  const periodeOpen = periode?.status === 'open'

  return (
    <PageTemplate
      title="Survei"
      description={`Pendataan kondisi KK di wilayah ${formatRt(user.rt)} untuk penilaian calon penerima bansos.`}
      actions={
        <Button
          icon={Plus}
          disabled={!periodeOpen}
          title={periodeOpen ? undefined : 'Survei baru hanya dapat dibuat pada periode yang dibuka'}
          onClick={() => setDialog({ type: 'create' })}
        >
          Mulai Survei
        </Button>
      }
    >
      {!periodeQuery.loading && !periodeList.length && (
        <Alert tone="info">Belum ada periode bansos. Survei dapat dimulai setelah perangkat desa membuka periode.</Alert>
      )}
      {periode && !periodeOpen && (
        <Alert tone="info">
          Periode "{periode.nama}" sudah ditutup. Survei pada periode ini hanya dapat dilihat.
        </Alert>
      )}

      {periode && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="search"
              size="sm"
              icon={Search}
              value={filters.q}
              onChange={setFilter('q')}
              placeholder="Cari No. KK atau nama kepala keluarga…"
              aria-label="Cari survei"
              className="min-w-60 flex-1"
            />
            <Select
              size="sm"
              value={filters.periodeId || String(periode.id)}
              onChange={setFilter('periodeId')}
              aria-label="Pilih periode"
              options={periodeList.map((p) => ({
                value: String(p.id),
                label: `${p.nama}${p.status === 'open' ? ' (dibuka)' : ''}`,
              }))}
            />
            <Select
              size="sm"
              value={filters.status}
              onChange={setFilter('status')}
              aria-label="Filter status"
              placeholder="Semua status"
              options={STATUS_SURVEI_OPTIONS}
            />
          </div>

          <DataTable
            columns={columns}
            rows={query.data?.data}
            loading={query.loading}
            error={query.error}
            onRetry={query.reload}
            emptyMessage={
              q || filters.status ? 'Tidak ada survei yang cocok dengan filter' : 'Belum ada survei pada periode ini'
            }
            footer={<Pagination meta={query.data?.meta} onPageChange={setPage} />}
          />
        </section>
      )}

      {dialog?.type === 'create' && (
        <MulaiSurveiModal
          periode={periode}
          onClose={() => setDialog(null)}
          onCreated={open}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Draf Survei"
          confirmLabel="Hapus"
          message={
            <>
              Hapus draf survei <strong className="text-fg">{dialog.survei.kk.kepalaKeluarga}</strong> beserta jawaban
              dan fotonya? KK ini dapat disurvei ulang pada periode yang sama.
            </>
          }
          onConfirm={() => deleteSurvei(dialog.survei)}
          onClose={() => setDialog(null)}
        />
      )}
    </PageTemplate>
  )
}
