import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: boolean
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, trailing, error, className, ...props },
  ref
) {
  if (!icon && !trailing) {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-surface border rounded-[10px] px-3.5 py-2.5 text-sm font-body text-ink-900 placeholder:text-ink-500 transition-shadow duration-150 focus:outline-none focus:border-teal-500 focus:ring-[3px] focus:ring-teal-tint',
          error ? 'border-crit-600 ring-[3px] ring-crit-tint' : 'border-line-strong',
          className
        )}
        {...props}
      />
    )
  }
  return (
    <div className="relative">
      {icon && (
        <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-500 [&>svg]:w-[17px] [&>svg]:h-[17px]">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-surface border rounded-[10px] py-2.5 text-sm font-body text-ink-900 placeholder:text-ink-500 transition-shadow duration-150 focus:outline-none focus:border-teal-500 focus:ring-[3px] focus:ring-teal-tint',
          icon ? 'ps-10 pe-3.5' : 'px-3.5',
          trailing && 'pe-10',
          error ? 'border-crit-600 ring-[3px] ring-crit-tint' : 'border-line-strong',
          className
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-ink-500 [&>svg]:w-[17px] [&>svg]:h-[17px] cursor-pointer">
          {trailing}
        </span>
      )}
    </div>
  )
})
