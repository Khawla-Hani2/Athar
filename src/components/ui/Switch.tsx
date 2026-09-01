import { cn } from '@/lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label'?: string
}

export function Switch({ checked, onChange, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'w-[42px] h-[24px] rounded-full transition-colors duration-150 relative shrink-0',
        checked ? 'bg-teal-700' : 'bg-line-strong'
      )}
      {...rest}
    >
      <span
        className={cn(
          'absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-card transition-all duration-150',
          checked ? 'start-[3px]' : 'start-[21px]'
        )}
      />
    </button>
  )
}
