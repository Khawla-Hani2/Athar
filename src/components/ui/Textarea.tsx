import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-surface border border-line-strong rounded-[10px] px-3.5 py-2.5 text-sm font-body text-ink-900 placeholder:text-ink-500 resize-y min-h-[88px] leading-relaxed transition-shadow duration-150 focus:outline-none focus:border-teal-500 focus:ring-[3px] focus:ring-teal-tint',
          className
        )}
        {...props}
      />
    )
  }
)
