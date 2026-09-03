import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { login, mapAuthError } from '@/services/authService'
import { isFirebaseConfigured } from '@/firebase/config'
import { authMessages } from '@/lib/messages'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFirebaseConfigured) {
      setError(authMessages.firebaseNotConfigured)
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="تسجيل الدخول إلى أَثَر"
      subtitle="رتّبي يومك، اصنعي إنجازك، واتركي أثرًا."
      showFirebaseNotice={!isFirebaseConfigured}
      footer={
        <>
          ليس لديكِ حساب؟{' '}
          <Link to="/signup" className="text-teal-600 font-semibold no-underline">
            أنشئي حسابًا
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4 mt-7" onSubmit={handleSubmit}>
        <Field label="البريد الإلكتروني">
          <Input
            type="email"
            icon={<Icon name="mail" />}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Field>
        <Field label="كلمة المرور">
          <Input
            type={showPassword ? 'text' : 'password'}
            icon={<Icon name="lock" />}
            trailing={
              <span onClick={() => setShowPassword((s) => !s)}>
                <Icon name="eye" />
              </span>
            }
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Field>

        {error && <p className="text-[12.5px] text-crit-600">{error}</p>}

        <Link to="/forgot-password" className="text-[12.5px] text-teal-600 font-semibold self-start no-underline">
          نسيت كلمة المرور؟
        </Link>

        <Button type="submit" className="w-full py-3 mt-1.5" disabled={loading}>
          {loading ? 'جارٍ الدخول…' : 'تسجيل الدخول'}
        </Button>
      </form>
    </AuthLayout>
  )
}
