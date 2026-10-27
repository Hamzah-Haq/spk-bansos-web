import { useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/AuthProvider.jsx'
import Button, { IconButton } from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DataTable, { Pagination } from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { useToast } from '../../components/Toast.jsx'
import { api, withQuery } from '../../lib/api.js'
import { formatRt } from '../../lib/format.js'
import { useApiQuery, useDebouncedValue } from '../../lib/hooks.js'
import KkFormModal from './KkFormModal.jsx'

const PAGE_SIZE = 10

const FILTER_CLASS =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:ring-4 ' +
  'focus:ring-primary/20 focus:outline-none'

// Data KK for both roles: desa sees the whole village (with an RT filter), an RT account only
// its own RT — the API scopes the list, this page only hides what doesn't apply.
export default function KkPage() {
  const { user } = useAuth()
  const isDesa = user.role === 'desa'
  const toast = useToast()

  const [filters, setFilters] = useState({
    q: '',
    rtId: '',
  })
  const [page, setPage] = useState(1)
  // { type: 'create' | 'edit' | 'delete', kk? }
  const [dialog, setDialog] = useState(null)

  const q = useDebouncedValue(filters.q.trim())
  const query = useApiQuery(
    withQuery('/kk', {
      q,
      rtId: filters.rtId,
      page,
      limit: PAGE_SIZE,
    }),
  )

  function setFilter(name) {
    return (e) => {
      setFilters((f) => ({ ...f, [name]: e.target.value }))
      setPage(1)
    }
  }

  function closeDialog() {
    setDialog(null)
  }

  function done(message) {
    toast.success(message)
    setDialog(null)
    query.reload()
  }

  async function deleteKk(kk) {
    await api(`/kk/${kk.id}`, { method: 'DELETE' })
    // Deleting the last row of a page would otherwise show an empty page
    if (query.data?.data.length === 1 && page > 1) setPage(page - 1)
    done(`KK ${kk.kepalaKeluarga} berhasil dihapus`)
  }

  const columns = [
    {
      key: 'noKk',
      header: 'No. KK',
      className: 'font-mono text-xs whitespace-nowrap',
    },
    {
      key: 'kepalaKeluarga',
      header: 'Kepala Keluarga',
      render: (kk) => (
        <div>
          <p className="font-medium">{kk.kepalaKeluarga}</p>
          <p className="text-xs text-fg-muted">{kk.alamat}</p>
        </div>
      ),
    },
    ...(isDesa
      ? [
          {
            key: 'rt',
            header: 'Wilayah',
            className: 'whitespace-nowrap',
            render: (kk) => formatRt(kk.rt),
          },
        ]
      : []),
    {
      key: 'jumlahAnggota',
      header: 'Anggota',
      className: 'text-right',
      render: (kk) => `${kk.jumlahAnggota} orang`,
    },
    {
      key: 'jumlahSurvei',
      header: 'Survei',
      className: 'text-right',
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (kk) => {
        const used = kk.jumlahSurvei > 0 || kk.jumlahHasil > 0
        return (
          <div className="flex justify-end gap-1">
            <IconButton
              icon={Pencil}
              label="Ubah data KK"
              tone="primary"
              onClick={() => setDialog({ type: 'edit', kk })}
            />
            <IconButton
              icon={Trash2}
              label={used ? 'KK sudah memiliki riwayat survei sehingga tidak dapat dihapus' : 'Hapus data KK'}
              tone="danger"
              disabled={used}
              onClick={() => setDialog({ type: 'delete', kk })}
            />
          </div>
        )
      },
    },
  ]

  const target = dialog?.kk
  const filtered = q || filters.rtId

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Data Kartu Keluarga"
        description={
          isDesa
            ? 'Daftar KK seluruh desa yang dapat disurvei sebagai calon penerima bansos.'
            : `Daftar KK di wilayah ${formatRt(user.rt)} yang dapat Anda survei.`
        }
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
              aria-hidden
            />
            <input
              type="search"
              value={filters.q}
              onChange={setFilter('q')}
              placeholder="Cari No. KK, nama kepala keluarga, atau alamat…"
              aria-label="Cari KK"
              className={`${FILTER_CLASS} w-full pl-9`}
            />
          </div>
          {isDesa && (
            <RtFilter
              value={filters.rtId}
              onChange={setFilter('rtId')}
            />
          )}
          <Button icon={Plus} onClick={() => setDialog({ type: 'create' })}>
            Tambah KK
          </Button>
        </div>

        <DataTable
          columns={columns}
          rows={query.data?.data}
          loading={query.loading}
          error={query.error}
          onRetry={query.reload}
          emptyMessage={filtered ? 'Tidak ada KK yang cocok dengan filter' : 'Belum ada data KK'}
          footer={<Pagination meta={query.data?.meta} onPageChange={setPage} />}
        />
      </section>

      {(dialog?.type === 'create' || dialog?.type === 'edit') && (
        <KkFormModal
          kk={target}
          onClose={closeDialog}
          onSaved={(saved) => done(`KK ${saved.kepalaKeluarga} berhasil ${target ? 'diperbarui' : 'ditambahkan'}`)}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Data KK"
          confirmLabel="Hapus"
          message={
            <>
              Hapus KK <strong className="text-fg">{target.kepalaKeluarga}</strong> (No. KK {target.noKk}) secara
              permanen? KK yang sudah memiliki riwayat survei tidak dapat dihapus.
            </>
          }
          onConfirm={() => deleteKk(target)}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}

// Only Perangkat Desa may read /rt, so the RT filter fetches it in its own component.
function RtFilter({ value, onChange }) {
  const rtQuery = useApiQuery('/rt')

  return (
    <select
      value={value}
      onChange={onChange}
      aria-label="Filter wilayah RT"
      className={FILTER_CLASS}
    >
      <option value="">Semua wilayah</option>
      {rtQuery.data?.data.map((rt) => (
        <option key={rt.id} value={rt.id}>
          {formatRt(rt)}
        </option>
      ))}
    </select>
  )
}
