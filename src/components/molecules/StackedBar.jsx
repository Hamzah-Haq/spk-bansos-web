// Part-to-whole bar: segments = [{ key, label, value, className }] filled left to right on a track
// that stands for the remainder of `total` (e.g. "not yet surveyed"). Segments are separated by a
// 2px gap and carry a tooltip; counts are also given as text (legend / table), never by color alone.
export default function StackedBar({ segments, total, label, size = 'md' }) {
  const visible = segments.filter((s) => s.value > 0)
  const height = size === 'sm' ? 'h-2' : 'h-3'

  return (
    <div
      role="img"
      aria-label={`${label}: ${segments.map((s) => `${s.label} ${s.value}`).join(', ')} dari ${total}`}
      className={`flex ${height} w-full gap-0.5 overflow-hidden rounded-full bg-surface-alt`}
    >
      {total > 0 &&
        visible.map((s) => (
          <span
            key={s.key}
            title={`${s.label}: ${s.value} dari ${total}`}
            className={`h-full first:rounded-l-full last:rounded-r-full ${s.className}`}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
    </div>
  )
}

// Swatch + label + count for each segment, plus the remainder; text stays in text colors.
export function StackedBarLegend({ segments, rest }) {
  const items = rest ? [...segments, rest] : segments
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-fg-muted">
      {items.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className={`size-2.5 rounded-sm ${s.className}`} aria-hidden />
          <span>{s.label}</span>
          <span className="font-semibold text-fg">{s.value.toLocaleString('id-ID')}</span>
        </li>
      ))}
    </ul>
  )
}
