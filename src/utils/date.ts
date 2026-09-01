const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)])
}

export const WEEKDAY_NAMES_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

export const WEEKDAY_NAMES_SHORT_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']

/** Week grid header order used across the app: Saturday → Friday */
export const WEEK_HEADER_AR = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج']

export const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function formatArabicDate(date: Date, withWeekday = true): string {
  const weekday = WEEKDAY_NAMES_AR[date.getDay()]
  const day = toArabicDigits(date.getDate())
  const month = MONTH_NAMES_AR[date.getMonth()]
  const year = toArabicDigits(date.getFullYear())
  return withWeekday ? `${weekday}، ${day} ${month} ${year}` : `${day} ${month} ${year}`
}

export function formatArabicDayMonth(date: Date): string {
  return `${toArabicDigits(date.getDate())} ${MONTH_NAMES_AR[date.getMonth()]}`
}

export function formatArabicTime(time: string | null | undefined): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  let h = Number(hStr)
  const m = Number(mStr)
  const period = h >= 12 ? 'م' : 'ص'
  h = h % 12
  if (h === 0) h = 12
  return `${toArabicDigits(h)}:${toArabicDigits(pad2(m))} ${period}`
}

export function combineDateTime(dateISO: string, time: string | null): Date {
  const d = fromISODate(dateISO)
  if (time) {
    const [h, m] = time.split(':').map(Number)
    d.setHours(h, m, 0, 0)
  } else {
    d.setHours(23, 59, 59, 999)
  }
  return d
}

/** Returns Saturday of the week containing `date` (week starts Saturday). */
export function startOfWeekSat(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0=Sun..6=Sat
  const diff = (day + 1) % 7 // days since last Saturday
  d.setDate(d.getDate() - diff)
  return d
}

export function endOfWeekSat(date: Date): Date {
  const start = startOfWeekSat(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function isSameISODate(a: string, b: string): boolean {
  return a === b
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
}

/** Countdown like "٣س ٢٠د" or "متأخرة منذ يوم" if in the past */
export function formatCountdown(target: Date, from: Date = new Date()): string {
  const diffMs = target.getTime() - from.getTime()
  if (diffMs <= 0) {
    return formatOverdueSince(target, from)
  }
  const totalMinutes = Math.floor(diffMs / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${toArabicDigits(days)}ي ${toArabicDigits(hours)}س`
  if (hours > 0) return `${toArabicDigits(hours)}س ${toArabicDigits(minutes)}د`
  return `${toArabicDigits(minutes)}د`
}

export function formatOverdueSince(target: Date, from: Date = new Date()): string {
  const diffMs = from.getTime() - target.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'متأخرة'
  if (days === 1) return 'متأخرة منذ يوم'
  if (days === 2) return 'متأخرة منذ يومين'
  if (days <= 10) return `متأخرة منذ ${toArabicDigits(days)} أيام`
  return `متأخرة منذ ${toArabicDigits(days)} يومًا`
}

export function isOverdue(task: { deadlineDate: string | null; deadlineTime: string | null; status: string }): boolean {
  if (task.status === 'completed' || !task.deadlineDate) return false
  const deadline = combineDateTime(task.deadlineDate, task.deadlineTime)
  return deadline.getTime() < Date.now()
}

export function getGreeting(date: Date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'ليلة سعيدة ✨'
  if (h < 12) return 'صباح الخير ✨'
  if (h < 17) return 'نهارك سعيد ✨'
  if (h < 20) return 'مساء الخير ✨'
  return 'مساء الخير ✨'
}

export function formatClock(date: Date): string {
  let h = date.getHours()
  const m = date.getMinutes()
  const period = h >= 12 ? 'م' : 'ص'
  h = h % 12
  if (h === 0) h = 12
  return `${toArabicDigits(h)}:${toArabicDigits(pad2(m))} ${period}`
}
