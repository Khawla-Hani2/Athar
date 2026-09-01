import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: number
}

export function Modal({ open, onClose, title, children, maxWidth = 600 }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-[rgba(15,21,23,0.45)] p-0 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full bg-surface-raised sm:rounded-lg shadow-card p-6 my-0 sm:my-auto min-h-screen sm:min-h-0'
        )}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[19px]">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="إغلاق">
            <Icon name="x" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
