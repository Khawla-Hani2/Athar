import {
  GoogleAuthProvider,
  linkWithPopup,
  reauthenticateWithPopup,
  unlink,
  type User,
} from 'firebase/auth'
import { auth } from '@/firebase/config'
import { GOOGLE_CALENDAR_SCOPE, GoogleCalendarEvent, NewGoogleEventInput } from '@/types/googleCalendar'
import { addDays, fromISODate, toISODate } from '@/utils/date'

const EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
/** Marks an event as ATHAR's own so the panel only offers edit/delete for events it created. */
const ATHAR_EXTENDED_PROPERTY = { private: { athar: 'true' } }

export type GoogleCalendarErrorReason = 'auth' | 'expired' | 'permission' | 'network' | 'popup' | 'unknown'

export class GoogleCalendarError extends Error {
  reason: GoogleCalendarErrorReason
  constructor(reason: GoogleCalendarErrorReason, message: string) {
    super(message)
    this.reason = reason
  }
}

function googleAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider()
  provider.addScope(GOOGLE_CALENDAR_SCOPE)
  provider.setCustomParameters({ prompt: 'consent' })
  return provider
}

function isGoogleLinked(user: User): boolean {
  return user.providerData.some((p) => p.providerId === 'google.com')
}

/** Firebase `auth/*` error codes surfaced while linking/reauthenticating with Google. */
function mapFirebaseAuthError(error: unknown): GoogleCalendarError {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code ?? '')
      : ''
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return new GoogleCalendarError('popup', 'تم إغلاق نافذة تسجيل الدخول قبل إتمام الربط.')
    case 'auth/popup-blocked':
      return new GoogleCalendarError('popup', 'المتصفح حظر نافذة تسجيل الدخول، فعّلي النوافذ المنبثقة وحاولي مرة أخرى.')
    case 'auth/credential-already-in-use':
    case 'auth/account-exists-with-different-credential':
      return new GoogleCalendarError('auth', 'حساب Google هذا مرتبط بالفعل بمستخدم آخر في أَثَر.')
    case 'auth/requires-recent-login':
      return new GoogleCalendarError('auth', 'لأمان حسابك، سجّلي الخروج والدخول مرة أخرى ثم أعيدي ربط Google Calendar.')
    case 'auth/network-request-failed':
      return new GoogleCalendarError('network', 'تعذّر الاتصال بالإنترنت أثناء الربط، حاولي مرة أخرى.')
    default:
      return new GoogleCalendarError('unknown', 'تعذّر ربط حساب Google، حاولي مرة أخرى.')
  }
}

export interface GoogleConnection {
  accessToken: string
  expiresAt: number
}

/**
 * Links (first time) or reauthenticates (already linked) the signed-in Firebase
 * user with Google, requesting Calendar access. Firebase's client SDK never
 * hands back a refresh token, so this must be called again by the user — via a
 * button click, never silently — whenever the access token expires.
 */
export async function connectGoogleAccount(): Promise<GoogleConnection> {
  const user = auth.currentUser
  if (!user) throw new GoogleCalendarError('auth', 'يجب تسجيل الدخول أولًا.')

  const provider = googleAuthProvider()
  try {
    const result = isGoogleLinked(user)
      ? await reauthenticateWithPopup(user, provider)
      : await linkWithPopup(user, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (!credential?.accessToken) {
      throw new GoogleCalendarError('permission', 'لم تتم الموافقة على صلاحية Google Calendar.')
    }
    // Firebase doesn't return the token's exact expiry; Google access tokens are
    // valid ~1h, so treat it as valid for 50 minutes to stay safely inside that.
    return { accessToken: credential.accessToken, expiresAt: Date.now() + 50 * 60 * 1000 }
  } catch (err) {
    if (err instanceof GoogleCalendarError) throw err
    throw mapFirebaseAuthError(err)
  }
}

/** Best-effort: clears the linked Google provider. Never throws — local state is cleared regardless. */
export async function disconnectGoogleAccount(): Promise<void> {
  const user = auth.currentUser
  if (!user || !isGoogleLinked(user)) return
  try {
    await unlink(user, 'google.com')
  } catch (err) {
    console.error('[athar] فشل إلغاء ربط حساب Google:', err)
  }
}

async function googleApiRequest<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${EVENTS_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new GoogleCalendarError('network', 'تعذّر الاتصال بخوادم Google، تحققي من اتصالك بالإنترنت.')
  }

  if (response.status === 401) {
    throw new GoogleCalendarError('expired', 'انتهت صلاحية الاتصال بـ Google Calendar، أعيدي الربط.')
  }
  if (response.status === 403) {
    throw new GoogleCalendarError(
      'permission',
      'لا تملك الصلاحية اللازمة للوصول إلى تقويم Google. تأكدي من قبول صلاحية التقويم عند الربط.'
    )
  }
  if (!response.ok) {
    throw new GoogleCalendarError('unknown', 'تعذّر التواصل مع Google Calendar، حاولي مرة أخرى.')
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

interface GoogleEventDateTime {
  date?: string
  dateTime?: string
}

interface GoogleEventResource {
  id: string
  summary?: string
  description?: string
  location?: string
  htmlLink?: string
  start?: GoogleEventDateTime
  end?: GoogleEventDateTime
  extendedProperties?: { private?: Record<string, string> }
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function localTimeHHmm(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function fromGoogleEvent(raw: GoogleEventResource): GoogleCalendarEvent {
  const allDay = Boolean(raw.start?.date)
  if (allDay) {
    const date = raw.start!.date!
    // Google's all-day `end.date` is exclusive — step back a day for an inclusive range.
    const endDate = raw.end?.date ? toISODate(addDays(fromISODate(raw.end.date), -1)) : date
    return {
      id: raw.id,
      title: raw.summary ?? '',
      description: raw.description ?? '',
      location: raw.location ?? '',
      date,
      endDate,
      startTime: null,
      endTime: null,
      allDay: true,
      htmlLink: raw.htmlLink ?? '',
      createdByAthar: raw.extendedProperties?.private?.athar === 'true',
    }
  }

  const start = new Date(raw.start!.dateTime!)
  const end = raw.end?.dateTime ? new Date(raw.end.dateTime) : start
  return {
    id: raw.id,
    title: raw.summary ?? '',
    description: raw.description ?? '',
    location: raw.location ?? '',
    date: toISODate(start),
    endDate: toISODate(start),
    startTime: localTimeHHmm(start),
    endTime: localTimeHHmm(end),
    allDay: false,
    htmlLink: raw.htmlLink ?? '',
    createdByAthar: raw.extendedProperties?.private?.athar === 'true',
  }
}

function toGoogleEventBody(input: NewGoogleEventInput): Record<string, unknown> {
  const base = {
    summary: input.title,
    description: input.description || undefined,
    location: input.location || undefined,
    extendedProperties: ATHAR_EXTENDED_PROPERTY,
  }

  if (input.startTime && input.endTime) {
    const start = fromISODate(input.date)
    const [sh, sm] = input.startTime.split(':').map(Number)
    start.setHours(sh, sm, 0, 0)
    const end = fromISODate(input.endDate ?? input.date)
    const [eh, em] = input.endTime.split(':').map(Number)
    end.setHours(eh, em, 0, 0)
    return { ...base, start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } }
  }

  const endExclusive = toISODate(addDays(fromISODate(input.endDate ?? input.date), 1))
  return { ...base, start: { date: input.date }, end: { date: endExclusive } }
}

export async function fetchCalendarEvents(
  accessToken: string,
  rangeStartISO: string,
  rangeEndISO: string
): Promise<GoogleCalendarEvent[]> {
  const timeMin = fromISODate(rangeStartISO).toISOString()
  const timeMax = new Date(fromISODate(rangeEndISO).getTime() + 24 * 60 * 60 * 1000).toISOString()
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })
  const data = await googleApiRequest<{ items?: GoogleEventResource[] }>(accessToken, `?${params.toString()}`)
  return (data.items ?? []).map(fromGoogleEvent)
}

export async function createCalendarEvent(
  accessToken: string,
  input: NewGoogleEventInput
): Promise<GoogleCalendarEvent> {
  const raw = await googleApiRequest<GoogleEventResource>(accessToken, '', {
    method: 'POST',
    body: JSON.stringify(toGoogleEventBody(input)),
  })
  return fromGoogleEvent(raw)
}

export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  input: NewGoogleEventInput
): Promise<GoogleCalendarEvent> {
  const raw = await googleApiRequest<GoogleEventResource>(accessToken, `/${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    body: JSON.stringify(toGoogleEventBody(input)),
  })
  return fromGoogleEvent(raw)
}

export async function deleteCalendarEvent(accessToken: string, eventId: string): Promise<void> {
  await googleApiRequest<void>(accessToken, `/${encodeURIComponent(eventId)}`, { method: 'DELETE' })
}

export function mapGoogleCalendarError(error: unknown): string {
  if (error instanceof GoogleCalendarError) return error.message
  return 'حدث خطأ غير متوقع مع Google Calendar، حاولي مرة أخرى.'
}
