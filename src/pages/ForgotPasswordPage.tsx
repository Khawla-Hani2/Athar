import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthPageShell } from '@/components/layout/AuthPageShell'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { requestPasswordReset, mapAuthError } from '@/services/authService'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell>
        <h1 className="text-[23px]">استعادة كلمة المرور</h1>
        <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">
          أدخلي بريدك الإلكتروني وسنرسل لكِ رابطًا لإعادة تعيين كلمة المرور.
        </p>

        {sent ? (
          <div className="mt-6 bg-success-tint text-success-700 rounded-lg p-4 text-[13.5px] leading-relaxed">
            تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني، تحققي من صندوق الوارد.
          </div>
        ) : (
          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <Field label="البريد الإلكتروني">
              <Input
                type="email"
                icon={<Icon name="mail" />}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            {error && <p className="text-[12.5px] text-crit-600">{error}</p>}
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'جارٍ الإرسال…' : 'إرسال رابط الاستعادة'}
            </Button>
          </form>
        )}

        <Link to="/login" className="block text-center mt-6 text-[12.5px] text-teal-600 font-semibold no-underline">
          الرجوع إلى تسجيل الدخول
        </Link>
    </AuthPageShell>
  )
}
