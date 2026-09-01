import { ReactNode } from 'react'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  optionalLabel?: string
}

export function Field({ label, hint, error, children, optionalLabel }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-ink-700">
        {label}
        {optionalLabel && <span className="font-normal text-ink-500"> {optionalLabel}</span>}
      </label>
      {children}
      {hint && !error && <span className="text-[11.5px] text-ink-500">{hint}</span>}
      {error && <span className="text-[11.5px] text-crit-600">{error}</span>}
    </div>
  )
}
