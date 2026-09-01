import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'حذف',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,21,23,0.45)] p-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[380px] bg-surface-raised rounded-lg shadow-card p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[52px] h-[52px] rounded-full bg-crit-tint flex items-center justify-center mx-auto mb-4.5 text-crit-600">
          <Icon name="warn" className="w-6 h-6" />
        </div>
        <h2 className="text-[17px]">{title}</h2>
        {description && <p className="text-[13px] text-ink-500 mt-2.5 leading-relaxed">{description}</p>}
        <div className="flex gap-2.5 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            <Icon name="trash" />
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
