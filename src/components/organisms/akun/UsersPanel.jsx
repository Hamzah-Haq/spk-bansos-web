import { useState } from 'react'
import { KeyRound, Pencil, Plus, Search, Trash2, UserCheck, UserX } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../../auth/roles.js'
import { api, withQuery } from '../../../lib/api.js'
import { formatRt } from '../../../lib/format.js'
import { useApiQuery, useDebouncedValue } from '../../../lib/hooks.js'
import Badge from '../../atoms/Badge.jsx'
import Button from '../../atoms/Button.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import Input from '../../atoms/Input.jsx'
import Select from '../../atoms/Select.jsx'
import Pagination from '../../molecules/Pagination.jsx'
import ConfirmDialog from '../ConfirmDialog.jsx'
import DataTable from '../DataTable.jsx'
import { useToast } from '../Toast.jsx'
import ResetPasswordModal from './ResetPasswordModal.jsx'
import UserFormModal from './UserFormModal.jsx'

const PAGE_SIZE = 10

const ROLE_FILTER_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

const STATUS_FILTER_OPTIONS = [
  {
    value: 'aktif',
    label: 'Aktif',
  },
  {
    value: 'nonaktif',
    label: 'Nonaktif',
  },
]

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
        <Input
          type="search"
          size="sm"
          icon={Search}
          value={filters.q}
          onChange={setFilter('q')}
          placeholder="Cari nama atau username…"
          aria-label="Cari akun"
          className="min-w-60 flex-1"
        />
        <Select
          size="sm"
          options={ROLE_FILTER_OPTIONS}
          placeholder="Semua jabatan"
          value={filters.role}
          onChange={setFilter('role')}
          aria-label="Filter jabatan"
        />
        <Select
          size="sm"
          options={STATUS_FILTER_OPTIONS}
          placeholder="Semua status"
          value={filters.status}
          onChange={setFilter('status')}
          aria-label="Filter status"
        />
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
