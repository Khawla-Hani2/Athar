import { ReactNode } from 'react'

interface TopbarProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 className="text-[22px] sm:text-[23px]">{title}</h1>
        {subtitle && <div className="text-[12.5px] text-ink-500 mt-1 flex gap-3 items-center flex-wrap">{subtitle}</div>}
      </div>
      {actions && <div className="flex gap-2.5 items-center flex-wrap">{actions}</div>}
    </div>
  )
}
