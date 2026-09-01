import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none bg-surface border border-line-strong rounded-[10px] px-3.5 py-2.5 text-sm font-body text-ink-900 transition-shadow duration-150 focus:outline-none focus:border-teal-500 focus:ring-[3px] focus:ring-teal-tint bg-no-repeat',
          className
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238C8372' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundPosition: 'left 12px center',
        }}
        {...props}
      >
        {children}
      </select>
    )
  }
)
