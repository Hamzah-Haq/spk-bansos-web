// One label/value line inside a <dl>.
export default function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}
