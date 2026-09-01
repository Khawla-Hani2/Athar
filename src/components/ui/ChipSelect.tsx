import { cn } from '@/lib/cn'

export interface ChipOption<T extends string> {
  value: T
  label: string
  dotColor: string
  activeBg: string
}

interface ChipSelectProps<T extends string> {
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function ChipSelect<T extends string>({ options, value, onChange }: ChipSelectProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-150',
              active ? 'border-transparent text-white' : 'border-line-strong bg-surface text-ink-700'
            )}
            style={active ? { background: opt.activeBg } : undefined}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: active ? '#fff' : opt.dotColor }}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
