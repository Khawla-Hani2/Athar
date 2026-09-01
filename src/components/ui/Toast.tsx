import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-xl px-4.5 py-3 text-[13.5px] font-medium shadow-pop max-w-[340px] w-full sm:w-auto',
              t.kind === 'error'
                ? 'bg-crit-700 text-paper-alt'
                : 'bg-ink-900 text-paper'
            )}
          >
            <Icon
              name={t.kind === 'error' ? 'warn' : 'check'}
              className={cn('w-[18px] h-[18px] shrink-0', t.kind === 'success' && 'text-success-600')}
            />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
