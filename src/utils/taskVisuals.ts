import { ChipOption } from '@/components/ui/ChipSelect'
import { TASK_PRIORITY_LABELS, TASK_TYPE_LABELS, TaskPriority, TaskType } from '@/types/task'

export const TYPE_DOT_VAR: Record<TaskType, string> = {
  study: 'var(--cat-study)',
  work: 'var(--cat-work)',
  project: 'var(--cat-project)',
  personal: 'var(--cat-personal)',
  general: 'var(--cat-general)',
}

export const PRIORITY_DOT_VAR: Record<TaskPriority, string> = {
  high: 'var(--pr-high)',
  medium: 'var(--pr-med)',
  low: 'var(--pr-low)',
}

export const TYPE_CHIP_OPTIONS: ChipOption<TaskType>[] = (
  Object.keys(TASK_TYPE_LABELS) as TaskType[]
).map((value) => ({
  value,
  label: TASK_TYPE_LABELS[value],
  dotColor: TYPE_DOT_VAR[value],
  activeBg: TYPE_DOT_VAR[value],
}))

export const PRIORITY_CHIP_OPTIONS: ChipOption<TaskPriority>[] = (
  Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]
).map((value) => ({
  value,
  label: TASK_PRIORITY_LABELS[value],
  dotColor: PRIORITY_DOT_VAR[value],
  activeBg: PRIORITY_DOT_VAR[value],
}))
