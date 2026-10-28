import { formatRt } from '../../../lib/format.js'
import { useApiQuery } from '../../../lib/hooks.js'
import Select from '../../atoms/Select.jsx'

// Toolbar filter by wilayah RT. Only Perangkat Desa may read /rt, so render it for desa only.
export default function RtFilter({ value, onChange }) {
  const rtQuery = useApiQuery('/rt')
  const options = (rtQuery.data?.data ?? []).map((rt) => ({
    value: String(rt.id),
    label: formatRt(rt),
  }))

  return (
    <Select
      size="sm"
      options={options}
      placeholder="Semua wilayah"
      value={value}
      onChange={onChange}
      aria-label="Filter wilayah RT"
    />
  )
}
