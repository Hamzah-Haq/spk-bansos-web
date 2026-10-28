// Questions of one criterion as radio groups. Scores are deliberately not shown to the RT, so the
// answer reflects the household's situation rather than the desired result.
export default function PertanyaanStep({ kriteria, answers, onAnswer, readOnly }) {
  return (
    <div className="space-y-6">
      {kriteria.pertanyaan.map((p) => (
        <fieldset key={p.id} className="space-y-2">
          <legend className="text-sm font-medium">
            <span className="mr-2 font-mono text-primary">{p.kode}.</span>
            {p.teks}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {p.opsi.map((o) => {
              const checked = answers[p.id] === o.id
              return (
                <label
                  key={o.id}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                    checked ? 'border-primary bg-primary/5' : 'border-border'
                  } ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-surface-alt'}`}
                >
                  <input
                    type="radio"
                    name={`pertanyaan-${p.id}`}
                    value={o.id}
                    checked={checked}
                    disabled={readOnly}
                    onChange={() => onAnswer(p.id, o.id)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>{o.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
