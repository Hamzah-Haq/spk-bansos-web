import { useState } from 'react'
import { KeyRound, Pencil, Plus, Search, Trash2, UserCheck, UserX } from 'lucide-react'
import { useAuth } from '../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../auth/roles.js'
import Badge from '../../components/Badge.jsx'
import Button, { IconButton } from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DataTable, { Pagination } from '../../components/DataTable.jsx'
import { useToast } from '../../components/Toast.jsx'
import { api, withQuery } from '../../lib/api.js'
import { formatRt } from '../../lib/format.js'
import { useApiQuery, useDebouncedValue } from '../../lib/hooks.js'
import ResetPasswordModal from './ResetPasswordModal.jsx'
import UserFormModal from './UserFormModal.jsx'

const PAGE_SIZE = 10

const FILTER_CLASS =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:ring-4 ' +
  'focus:ring-primary/20 focus:outline-none'

export default function UsersPanel() {
  const { user: me } = useAuth()
  const toast = useToast()

  const [filters, setFilters] = useState({
    q: '',
    role: '',
    status: '',
  })
  const [page, setPage] = useState(1)
  // { type: 'create' | 'edit' | 'password' | 'toggle' | 'delete', user? }
  const [dialog, setDialog] = useState(null)

  const q = useDebouncedValue(filters.q.trim())
  const query = useApiQuery(
    withQuery('/users', {
      q,
      role: filters.role,
      status: filters.status,
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

  async function toggleActive(user) {
    await api(`/users/${user.id}`, { method: 'PATCH', body: { isActive: !user.isActive } })
    done(`Akun ${user.username} berhasil ${user.isActive ? 'dinonaktifkan' : 'diaktifkan'}`)
  }

  async function deleteUser(user) {
    await api(`/users/${user.id}`, { method: 'DELETE' })
    // Deleting the last row of a page would otherwise show an empty page
    if (query.data?.data.length === 1 && page > 1) setPage(page - 1)
    done(`Akun ${user.username} berhasil dihapus`)
  }

  const columns = [
    {
      key: 'nama',
      header: 'Nama',
      render: (u) => (
        <div>
          <p className="font-medium">
            {u.nama}
            {u.id === me.id && <span className="ml-2 text-xs font-normal text-fg-muted">(Anda)</span>}
          </p>
          <p className="text-xs text-fg-muted">{u.username}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Jabatan',
      render: (u) => <Badge tone={u.role === 'desa' ? 'primary' : 'info'}>{ROLE_LABELS[u.role]}</Badge>,
    },
    {
      key: 'rt',
      header: 'Wilayah',
      render: (u) => formatRt(u.rt),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (u) => <Badge tone={u.isActive ? 'success' : 'neutral'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</Badge>,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (u) => {
        const self = u.id === me.id
        return (
          <div className="flex justify-end gap-1">
            <IconButton
              icon={Pencil}
              label="Ubah akun"
              tone="primary"
              onClick={() => setDialog({ type: 'edit', user: u })}
            />
            <IconButton
              icon={KeyRound}
              label={self ? 'Ganti password Anda di menu Pengaturan' : 'Atur ulang password'}
              tone="warning"
              disabled={self}
              onClick={() => setDialog({ type: 'password', user: u })}
            />
            <IconButton
              icon={u.isActive ? UserX : UserCheck}
              label={self ? 'Tidak dapat menonaktifkan akun sendiri' : u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              tone={u.isActive ? 'warning' : 'success'}
              disabled={self}
              onClick={() => setDialog({ type: 'toggle', user: u })}
            />
            <IconButton
              icon={Trash2}
              label={self ? 'Tidak dapat menghapus akun sendiri' : 'Hapus akun'}
              tone="danger"
              disabled={self}
              onClick={() => setDialog({ type: 'delete', user: u })}
            />
          </div>
        )
      },
    },
  ]

  const target = dialog?.user

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" aria-hidden />
          <input
            type="search"
            value={filters.q}
            onChange={setFilter('q')}
            placeholder="Cari nama atau username…"
            aria-label="Cari akun"
            className={`${FILTER_CLASS} w-full pl-9`}
          />
        </div>
        <select
          value={filters.role}
          onChange={setFilter('role')}
          aria-label="Filter jabatan"
          className={FILTER_CLASS}
        >
          <option value="">Semua jabatan</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={setFilter('status')}
          aria-label="Filter status"
          className={FILTER_CLASS}
        >
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <Button icon={Plus} onClick={() => setDialog({ type: 'create' })}>
          Tambah Akun
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={query.data?.data}
        loading={query.loading}
        error={query.error}
        onRetry={query.reload}
        emptyMessage={q || filters.role || filters.status ? 'Tidak ada akun yang cocok dengan filter' : 'Belum ada akun'}
        footer={<Pagination meta={query.data?.meta} onPageChange={setPage} />}
      />

      {(dialog?.type === 'create' || dialog?.type === 'edit') && (
        <UserFormModal
          user={target}
          isSelf={target?.id === me.id}
          onClose={closeDialog}
          onSaved={(saved) => done(`Akun ${saved.username} berhasil ${target ? 'diperbarui' : 'ditambahkan'}`)}
        />
      )}

      {dialog?.type === 'password' && (
        <ResetPasswordModal
          user={target}
          onClose={closeDialog}
          onSaved={() => done(`Password ${target.username} berhasil diatur ulang`)}
        />
      )}

      {dialog?.type === 'toggle' && (
        <ConfirmDialog
          title={target.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
          tone={target.isActive ? 'danger' : 'primary'}
          confirmLabel={target.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          message={
            target.isActive ? (
              <>
                Akun <strong className="text-fg">{target.username}</strong> tidak akan bisa masuk dan akan langsung
                keluar dari semua perangkat. Data survei yang sudah dibuat tetap tersimpan.
              </>
            ) : (
              <>
                Akun <strong className="text-fg">{target.username}</strong> akan dapat masuk kembali.
              </>
            )
          }
          onConfirm={() => toggleActive(target)}
          onClose={closeDialog}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Akun"
          confirmLabel="Hapus"
          message={
            <>
              Hapus akun <strong className="text-fg">{target.username}</strong> secara permanen? Akun yang sudah
              memiliki riwayat survei tidak dapat dihapus; nonaktifkan saja.
            </>
          }
          onConfirm={() => deleteUser(target)}
          onClose={closeDialog}
        />
      )}
    </section>
  )
}
