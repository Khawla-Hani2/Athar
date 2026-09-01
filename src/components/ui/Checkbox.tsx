import { cn } from '@/lib/cn'
import { Icon } from './Icon'

interface CheckboxProps {
  checked: boolean
  onChange?: () => void
  round?: boolean
  className?: string
  'aria-label'?: string
}

export function Checkbox({ checked, onChange, round, className, ...rest }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'w-5 h-5 shrink-0 flex items-center justify-center border-[1.6px] transition-all duration-150',
        round ? 'rounded-full' : 'rounded-[7px]',
        checked ? 'bg-teal-700 border-teal-700' : 'bg-surface border-line-strong',
        className
      )}
      {...rest}
    >
      <Icon
        name="check"
        className={cn(
          'w-3 h-3 text-white transition-all duration-150',
          checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        )}
      />
    </button>
  )
}
