import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'sm' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-teal-700 text-paper hover:bg-teal-600',
  secondary: 'bg-surface text-ink-900 border border-line-strong hover:border-teal-500 hover:text-teal-700',
  ghost: 'bg-transparent text-ink-700 hover:bg-paper-alt hover:text-ink-900',
  danger: 'bg-crit-600 text-paper hover:bg-crit-700',
}

const SIZE_CLASS: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm rounded-[11px]',
  sm: 'px-3.5 py-1.5 text-[12.5px] rounded-[9px]',
  icon: 'p-2.5 rounded-[10px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold border border-transparent transition-colors duration-150 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
