import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface LogoProps {
  withWordmark?: boolean
  className?: string
  size?: number
  tone?: 'default' | 'inverted' | 'gold'
}

const TONE_CLASS: Record<NonNullable<LogoProps['tone']>, string> = {
  default: 'text-teal-700',
  inverted: 'text-paper',
  gold: 'text-sand-600',
}

export function Logo({ withWordmark = true, className, size = 30, tone = 'default' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Icon name="athar" className={TONE_CLASS[tone]} style={{ width: size, height: size }} />
      {withWordmark && (
        <b className={cn('font-display text-[18px] font-semibold', tone === 'inverted' ? 'text-paper' : 'text-ink-900')}>
          أَثَر
        </b>
      )}
    </div>
  )
}
