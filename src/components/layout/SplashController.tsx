import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { hideSplashScreen } from '@/lib/splash'

/**
 * Dismisses the initial splash screen (defined in `index.html`) once auth has
 * resolved, so the first thing the user sees is the real app rather than a
 * second loading state. Renders nothing.
 */
export function SplashController() {
  const { loading } = useAuth()

  useEffect(() => {
    if (!loading) hideSplashScreen()
  }, [loading])

  return null
}
