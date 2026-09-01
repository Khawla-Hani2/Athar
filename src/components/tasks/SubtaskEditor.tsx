import { useState } from 'react'
import { Subtask } from '@/types/task'
import { Checkbox } from '@/components/ui/Checkbox'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

interface SubtaskEditorProps {
  subtasks: Subtask[]
  onChange: (subtasks: Subtask[]) => void
}

export function SubtaskEditor({ subtasks, onChange }: SubtaskEditorProps) {
  const [draft, setDraft] = useState('')

  const addSubtask = () => {
    const title = draft.trim()
    if (!title) return
    onChange([...subtasks, { id: crypto.randomUUID(), title, done: false }])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      {subtasks.map((s) => (
        <div key={s.id} className="flex items-center gap-2.5">
          <Checkbox
            checked={s.done}
            onChange={() => onChange(subtasks.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)))}
          />
          <span className="text-[13.5px] flex-1">{s.title}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="p-1"
            onClick={() => onChange(subtasks.filter((x) => x.id !== s.id))}
            aria-label="حذف المهمة الفرعية"
          >
            <Icon name="x" className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-0.5">
        <Icon name="plus" className="w-[15px] h-[15px] text-ink-500" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSubtask()
            }
          }}
          placeholder="إضافة مهمة فرعية…"
          className="flex-1 border-none bg-transparent py-1 text-[13px] focus:outline-none placeholder:text-ink-500"
        />
      </div>
    </div>
  )
}
