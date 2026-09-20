import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './useAuth'
import {
  GoogleCalendarError,
  connectGoogleAccount,
  disconnectGoogleAccount,
  mapGoogleCalendarError,
  type GoogleConnection,
} from '@/services/googleCalendarService'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected'

interface GoogleCalendarContextValue {
  status: ConnectionStatus
  error: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  /** Returns the current access token or throws a `GoogleCalendarError('expired', …)`. */
  getAccessToken: () => string
  /** Flips the connection to "needs reconnect" — called when an API call reports an expired/invalid token. */
  markExpired: (message: string) => void
}

const GoogleCalendarContext = createContext<GoogleCalendarContextValue | null>(null)

function storageKey(uid: string): string {
  return `athar:google-calendar:${uid}`
}

function readStoredConnection(uid: string): GoogleConnection | null {
  try {
    const raw = sessionStorage.getItem(storageKey(uid))
    if (!raw) return null
    const parsed = JSON.parse(raw) as GoogleConnection
    if (!parsed.accessToken || !parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      sessionStorage.removeItem(storageKey(uid))
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function GoogleCalendarProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [connection, setConnection] = useState<GoogleConnection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setStatus('disconnected')
      setConnection(null)
      setError(null)
      return
    }
    const stored = readStoredConnection(user.uid)
    setConnection(stored)
    setStatus(stored ? 'connected' : 'disconnected')
  }, [user])

  const connect = async () => {
    if (!user) return
    setStatus('connecting')
    setError(null)
    try {
      const conn = await connectGoogleAccount()
      sessionStorage.setItem(storageKey(user.uid), JSON.stringify(conn))
      setConnection(conn)
      setStatus('connected')
    } catch (err) {
      setStatus('disconnected')
      setConnection(null)
      const message = mapGoogleCalendarError(err)
      setError(message)
      throw err instanceof GoogleCalendarError ? err : new GoogleCalendarError('unknown', message)
    }
  }

  const disconnect = async () => {
    if (user) sessionStorage.removeItem(storageKey(user.uid))
    setConnection(null)
    setStatus('disconnected')
    setError(null)
    await disconnectGoogleAccount()
  }

  const markExpired = (message: string) => {
    if (user) sessionStorage.removeItem(storageKey(user.uid))
    setConnection(null)
    setStatus('disconnected')
    setError(message)
  }

  const getAccessToken = (): string => {
    if (!connection || connection.expiresAt <= Date.now()) {
      throw new GoogleCalendarError('expired', 'انتهت صلاحية الاتصال بـ Google Calendar، أعيدي الربط.')
    }
    return connection.accessToken
  }

  return (
    <GoogleCalendarContext.Provider value={{ status, error, connect, disconnect, getAccessToken, markExpired }}>
      {children}
    </GoogleCalendarContext.Provider>
  )
}

export function useGoogleCalendar() {
  const ctx = useContext(GoogleCalendarContext)
  if (!ctx) throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider')
  return ctx
}
