import { authMessages } from './messages'

export const MIN_PASSWORD_LENGTH = 8

/**
 * Validates a new password (and, when provided, its confirmation).
 * Returns an Arabic error message, or `null` when the input is acceptable.
 */
export function getPasswordError(password: string, confirmation?: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return authMessages.passwordTooShort
  }
  if (confirmation !== undefined && password !== confirmation) {
    return authMessages.passwordMismatch
  }
  return null
}
