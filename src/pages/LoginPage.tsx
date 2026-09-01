import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { login, mapAuthError } from '@/services/authService'
import { isFirebaseConfigured } from '@/firebase/config'

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
      setError('لم يتم إعداد Firebase بعد. أضيفي بيانات المشروع في ملف .env')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(mapAuthError(err?.code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[360px]">
          <Logo withWordmark={false} size={42} className="mb-4.5" />
          <h1 className="text-[24px] sm:text-[26px]">تسجيل الدخول إلى أَثَر</h1>
          <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">
            رتّبي يومك، اصنعي إنجازك، واتركي أثرًا.
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-4 bg-sand-tint text-sand-700 rounded-lg p-3.5 text-[12.5px] leading-relaxed">
              لم يتم إعداد Firebase بعد. أنشئي مشروعًا في Firebase Console وأضيفي بياناته إلى ملف .env
            </div>
          )}

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
        </div>
      </div>

      <div className="hidden md:block flex-1 relative overflow-hidden bg-gradient-to-br from-teal-900 via-[#123f3b] to-palm-700">
        <svg viewBox="0 0 400 640" className="absolute inset-0 w-full h-full opacity-90" preserveAspectRatio="xMidYMid slice">
          <path d="M0 420 Q100 380 200 420 T400 420" stroke="#E0B978" strokeWidth="1.4" fill="none" opacity=".5" />
          <path d="M0 460 Q100 425 200 460 T400 460" stroke="#F1E9D8" strokeWidth="1.4" fill="none" opacity=".3" />
          <path d="M0 500 Q100 470 200 500 T400 500" stroke="#E0B978" strokeWidth="1.4" fill="none" opacity=".2" />
        </svg>
        <Icon name="athar" className="absolute w-[210px] h-[210px] text-paper-alt opacity-[0.08] top-16 -end-8" />
        <div className="absolute bottom-14 inset-x-14 text-paper-alt">
          <p className="font-display text-[19px] lg:text-[21px] leading-relaxed">
            "مساحتك الخاصة لتعرفي ماذا أنجزتِ، وماذا تحتاجين، وما الذي يستحق تركيزك الآن."
          </p>
        </div>
      </div>
    </div>
  )
}
