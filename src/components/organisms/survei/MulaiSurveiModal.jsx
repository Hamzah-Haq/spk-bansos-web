import { useState } from 'react'
import { Search } from 'lucide-react'
import { api, withQuery } from '../../../lib/api.js'
import { useApiQuery, useDebouncedValue, useForm } from '../../../lib/hooks.js'
import Input from '../../atoms/Input.jsx'
import Spinner from '../../atoms/Spinner.jsx'
import FormModal from '../FormModal.jsx'

const RESULT_LIMIT = 8

// Pick a KK of the RT's own wilayah that has no survey yet in `periode`, then create a draft.
export default function MulaiSurveiModal({ periode, onClose, onCreated }) {
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim())
  const kkQuery = useApiQuery(
    withQuery('/kk', {
      q,
      tanpaSurvei: periode.id,
      limit: RESULT_LIMIT,
    }),
  )
  const form = useForm({ kkId: '' })
  const kkList = kkQuery.data?.data ?? []
  const total = kkQuery.data?.meta.total ?? 0

  function save() {
    return form.submit(
      async ({ kkId }) => {
        const { data } = await api('/survei', { method: 'POST', body: { kkId: Number(kkId) } })
        onCreated(data)
      },
      (v) => (v.kkId ? {} : { kkId: 'Pilih KK yang akan disurvei' }),
    )
  }

  const kkField = form.field('kkId')

  return (
    <FormModal
      title="Mulai Survei"
      description={`Periode ${periode.nama}. Hanya KK yang belum disurvei pada periode ini yang ditampilkan.`}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      submitLabel="Mulai Survei"
      error={form.error}
    >
      <Input
        type="search"
        size="sm"
        icon={Search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari No. KK atau nama kepala keluarga…"
        aria-label="Cari KK"
        autoFocus
        className="w-full"
      />

      <fieldset>
        <legend className="sr-only">Pilih KK</legend>
        {kkQuery.loading && !kkList.length ? (
          <div className="flex justify-center py-6 text-fg-muted">
            <Spinner />
          </div>
        ) : kkList.length === 0 ? (
          <p className="py-6 text-center text-sm text-fg-muted">
            {q ? 'Tidak ada KK yang cocok.' : 'Semua KK di wilayah Anda sudah disurvei pada periode ini.'}
          </p>
        ) : (
          <ul className="max-h-72 space-y-1.5 overflow-y-auto">
            {kkList.map((kk) => {
              const checked = kkField.value === String(kk.id)
              return (
                <li key={kk.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                      checked ? 'border-primary bg-primary/5' : 'border-border hover:bg-surface-alt'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kkId"
                      value={kk.id}
                      checked={checked}
                      onChange={kkField.onChange}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="block font-medium">{kk.kepalaKeluarga}</span>
                      <span className="block font-mono text-xs text-fg-muted">{kk.noKk}</span>
                      <span className="block text-xs text-fg-muted">{kk.alamat}</span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
        {total > kkList.length && (
          <p className="mt-2 text-xs text-fg-muted">
            Menampilkan {kkList.length} dari {total} KK. Gunakan pencarian untuk menemukan KK lainnya.
          </p>
        )}
        {kkField.error && <p className="mt-2 text-xs text-danger">{kkField.error}</p>}
      </fieldset>
    </FormModal>
  )
}
