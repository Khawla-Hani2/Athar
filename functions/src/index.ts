import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import {
  emailUser,
  getAllUserIds,
  getUserSettings,
  userSettingsRef,
  userTasksRef,
} from './helpers.js'
import { TaskDoc, TASK_PRIORITY_LABELS_AR } from './types.js'

initializeApp()
const db = getFirestore()

const TIME_ZONE = 'Asia/Riyadh'

interface ClockParts {
  dateISO: string
  hh: string
  mm: string
  weekday: string
}

function nowParts(): ClockParts {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  })
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]))
  const dateISO = `${parts.year}-${parts.month}-${parts.day}`
  return { dateISO, hh: parts.hour, mm: parts.minute, weekday: parts.weekday }
}

function timeWithinWindow(target: string, current: { hh: string; mm: string }, windowMinutes = 5): boolean {
  const [th, tm] = target.split(':').map(Number)
  const targetMinutes = th * 60 + tm
  const currentMinutes = Number(current.hh) * 60 + Number(current.mm)
  return Math.abs(currentMinutes - targetMinutes) < windowMinutes
}

/** يشمل مهام اليوم (تاريخ المهمة أو الموعد النهائي يقع اليوم) وهي غير منجزة */
async function fetchTodayTasks(uid: string, todayISO: string): Promise<TaskDoc[]> {
  const snap = await userTasksRef(uid).where('status', '==', 'pending').get()
  return snap.docs
    .map((d) => d.data() as TaskDoc)
    .filter((t) => {
      const end = t.endDate ?? t.date
      const dueToday = t.date <= todayISO && end >= todayISO
      const deadlineToday = t.deadlineDate === todayISO
      return dueToday || deadlineToday
    })
}

// ─────────────────────────────────────────────────────────────
// الملخص اليومي بالبريد الإلكتروني
// ─────────────────────────────────────────────────────────────
export const sendDailySummaries = onSchedule('every 5 minutes', async () => {
  const { dateISO, hh, mm } = nowParts()
  const userIds = await getAllUserIds()

  for (const uid of userIds) {
    const settings = await getUserSettings(uid)
    if (!settings?.notifications?.dailyEmailEnabled) continue
    if (settings.lastDailyEmailSentDate === dateISO) continue
    if (!timeWithinWindow(settings.notifications.dailyEmailTime ?? '08:00', { hh, mm })) continue

    const tasks = await fetchTodayTasks(uid, dateISO)
    if (tasks.length === 0) continue

    const highPriorityDueToday = tasks.filter(
      (t) => t.priority === 'high' && (t.deadlineDate === dateISO || t.date === dateISO)
    )

    let body = `<p>صباح الخير </p><p>لديك اليوم <b>${tasks.length}</b> ${tasks.length === 1 ? 'مهمة' : 'مهام'}.</p>`
    if (highPriorityDueToday.length > 0) {
      body += `<p>منها <b>${highPriorityDueToday.length}</b> ${highPriorityDueToday.length === 1 ? 'مهمة عالية الأولوية وموعدها النهائي اليوم' : 'مهام عالية الأولوية وموعدها النهائي اليوم'}.</p>`
    }
    body += '<ul>' + tasks.slice(0, 10).map((t) => `<li>${t.title} — ${TASK_PRIORITY_LABELS_AR[t.priority]}</li>`).join('') + '</ul>'

    await emailUser(uid, 'أَثَر — ملخصك اليومي', body)
    await userSettingsRef(uid).set({ lastDailyEmailSentDate: dateISO }, { merge: true })
  }
})

// ─────────────────────────────────────────────────────────────
// تنبيهات المواعيد النهائية (حسب اختيار كل مهمة: قبل ساعة / 12 ساعة / يوم)
// ─────────────────────────────────────────────────────────────
const REMINDER_OFFSET_MS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
}

export const sendDeadlineReminders = onSchedule('every 15 minutes', async () => {
  const now = Date.now()
  const userIds = await getAllUserIds()

  for (const uid of userIds) {
    const settings = await getUserSettings(uid)
    if (!settings?.notifications?.deadlineNotificationsEnabled) continue

    const tasksSnap = await userTasksRef(uid).where('status', '==', 'pending').get()

    for (const doc of tasksSnap.docs) {
      const task = doc.data() as TaskDoc
      if (task.reminder === 'none' || !task.deadlineDate || task.reminderSentAt) continue

      const deadline = new Date(`${task.deadlineDate}T${task.deadlineTime ?? '23:59'}:00`).getTime()
      const notifyAt = deadline - REMINDER_OFFSET_MS[task.reminder]

      if (now >= notifyAt && now < deadline) {
        await emailUser(
          uid,
          `أَثَر — تذكير: ${task.title}`,
          `<p>يقترب الموعد النهائي لمهمة <b>${task.title}</b>.</p><p>الأولوية: ${TASK_PRIORITY_LABELS_AR[task.priority]}</p>`
        )
        await doc.ref.set({ reminderSentAt: now }, { merge: true })
      }
    }
  }
})

// ─────────────────────────────────────────────────────────────
// الملخص الأسبوعي (يُرسل يوم الجمعة، نهاية الأسبوع)
// ─────────────────────────────────────────────────────────────
export const sendWeeklySummaries = onSchedule('every 15 minutes', async () => {
  const { dateISO, hh, mm, weekday } = nowParts()
  if (weekday !== 'Fri') return

  const userIds = await getAllUserIds()
  for (const uid of userIds) {
    const settings = await getUserSettings(uid)
    if (!settings?.notifications?.weeklySummaryEnabled) continue
    if (settings.lastWeeklySummarySentDate === dateISO) continue
    if (!timeWithinWindow(settings.notifications.dailyEmailTime ?? '08:00', { hh, mm })) continue

    const tasksSnap = await userTasksRef(uid).get()
    const tasks = tasksSnap.docs.map((d) => d.data() as TaskDoc)

    const weekAgoISO = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const weekTasks = tasks.filter((t) => t.date >= weekAgoISO && t.date <= dateISO)
    const completed = weekTasks.filter((t) => t.status === 'completed').length
    const total = weekTasks.length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    await emailUser(
      uid,
      'أَثَر — ملخصك الأسبوعي',
      `<p>هذا أسبوعك في أَثَر </p><p>أنجزتِ <b>${completed}</b> من أصل <b>${total}</b> مهمة — نسبة إنجاز <b>${percentage}٪</b>.</p>`
    )
    await userSettingsRef(uid).set({ lastWeeklySummarySentDate: dateISO }, { merge: true })
  }
})

// ─────────────────────────────────────────────────────────────
// التنظيف الشهري: أرشفة نسبة الإنجاز وحذف تفاصيل المهام المنجزة القديمة
// ─────────────────────────────────────────────────────────────
export const runMonthlyCleanup = onSchedule({ schedule: '0 3 1 * *', timeZone: TIME_ZONE }, async () => {
  const now = new Date()
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const y = prevMonthDate.getFullYear()
  const m = prevMonthDate.getMonth()
  const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`
  const monthStartISO = `${y}-${String(m + 1).padStart(2, '0')}-01`
  const monthEndDate = new Date(y, m + 1, 0)
  const monthEndISO = `${monthEndDate.getFullYear()}-${String(monthEndDate.getMonth() + 1).padStart(2, '0')}-${String(monthEndDate.getDate()).padStart(2, '0')}`

  const userIds = await getAllUserIds()
  for (const uid of userIds) {
    const tasksCol = userTasksRef(uid)
    const snap = await tasksCol.get()
    const monthTasks = snap.docs.filter((d) => {
      const t = d.data() as TaskDoc
      const start = t.date
      const end = t.endDate ?? t.date
      return start <= monthEndISO && end >= monthStartISO
    })

    const completed = monthTasks.filter((d) => (d.data() as TaskDoc).status === 'completed').length
    const total = monthTasks.length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    await db
      .collection('users')
      .doc(uid)
      .collection('monthlyHistory')
      .doc(monthKey)
      .set({ month: monthKey, percentage, completedCount: completed, totalCount: total })

    const toDelete = monthTasks.filter((d) => (d.data() as TaskDoc).status === 'completed')
    const batchSize = 400
    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = db.batch()
      toDelete.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }
  }
})
