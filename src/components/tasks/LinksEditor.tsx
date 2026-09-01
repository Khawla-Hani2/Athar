import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'

interface LinksEditorProps {
  links: string[]
  onChange: (links: string[]) => void
}

export function LinksEditor({ links, onChange }: LinksEditorProps) {
  const [draft, setDraft] = useState('')

  const addLink = () => {
    const url = draft.trim()
    if (!url) return
    onChange([...links, url])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-teal-tint text-teal-700 max-w-full"
            >
              <Icon name="link" className="w-[11px] h-[11px] shrink-0" />
              <span className="truncate max-w-[220px]" dir="ltr">
                {link}
              </span>
              <button type="button" onClick={() => onChange(links.filter((_, idx) => idx !== i))} aria-label="حذف الرابط">
                <Icon name="x" className="w-[9px] h-[9px]" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        icon={<Icon name="link" />}
        placeholder="أضيفي رابطًا…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        dir="ltr"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addLink()
          }
        }}
        onBlur={addLink}
      />
    </div>
  )
}
