/**
 * Controls the initial splash screen.
 *
 * The splash markup and styles live in `index.html` so it paints instantly on
 * first load and on refresh — before any JavaScript runs. This module only
 * coordinates dismissing it once the app is ready (see `SplashController`).
 */

const SPLASH_ELEMENT_ID = 'splash'
const HIDDEN_CLASS = 'splash--hidden'

/** Keep the splash visible at least this long so it reads as intentional, not a flash. */
const MIN_VISIBLE_MS = 600
/** Never keep the app behind the splash longer than this, whatever happens. */
const MAX_VISIBLE_MS = 4000
/** Must stay in sync with the opacity transition in `index.html`. */
const FADE_OUT_MS = 450

let dismissed = false

function fadeOutAndRemove(): void {
  const element = document.getElementById(SPLASH_ELEMENT_ID)
  if (!element) return

  element.classList.add(HIDDEN_CLASS)

  let removed = false
  const remove = () => {
    if (removed) return
    removed = true
    element.remove()
  }

  element.addEventListener('transitionend', remove, { once: true })
  window.setTimeout(remove, FADE_OUT_MS + 150)
}

/**
 * Fades out and removes the splash screen, honouring a minimum visible time.
 * Idempotent and safe to call before the DOM is fully ready.
 */
export function hideSplashScreen(): void {
  if (dismissed) return
  dismissed = true

  const elapsed = typeof performance !== 'undefined' ? performance.now() : MIN_VISIBLE_MS
  const remainingMinTime = Math.max(0, MIN_VISIBLE_MS - elapsed)
  window.setTimeout(fadeOutAndRemove, remainingMinTime)
}

// Failsafe: dismiss even if the app never signals that it is ready.
if (typeof window !== 'undefined') {
  window.setTimeout(hideSplashScreen, MAX_VISIBLE_MS)
}
