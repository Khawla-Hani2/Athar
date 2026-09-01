import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { signup, mapAuthError } from '@/services/authService'
import { isFirebaseConfigured } from '@/firebase/config'
import { authMessages } from '@/lib/messages'
import { getPasswordError } from '@/lib/validation'

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFirebaseConfigured) {
      setError(authMessages.firebaseNotConfigured)
      return
    }
    const passwordError = getPasswordError(password, confirm)
    if (passwordError) {
      setError(passwordError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('[athar] فشل إنشاء الحساب:', err)
      setError(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="إنشاء حساب في أَثَر"
      subtitle="ابدئي رحلتك: رتّبي يومك، اصنعي إنجازك، واتركي أثرًا."
      showFirebaseNotice={!isFirebaseConfigured}
      footer={
        <>
          لديكِ حساب بالفعل؟{' '}
          <Link to="/login" className="text-teal-600 font-semibold no-underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4 mt-7" onSubmit={handleSubmit}>
        <Field label="الاسم">
          <Input
            type="text"
            icon={<Icon name="user" />}
            placeholder="اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </Field>
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
        <Field label="كلمة المرور" hint="٨ أحرف على الأقل">
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
            autoComplete="new-password"
          />
        </Field>
        <Field label="تأكيد كلمة المرور">
          <Input
            type={showPassword ? 'text' : 'password'}
            icon={<Icon name="lock" />}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </Field>

        {error && <p className="text-[12.5px] text-crit-600">{error}</p>}

        <Button type="submit" className="w-full py-3 mt-1.5" disabled={loading}>
          {loading ? 'جارٍ إنشاء الحساب…' : 'إنشاء حساب'}
        </Button>
      </form>
    </AuthLayout>
  )
}
