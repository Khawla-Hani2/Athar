import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { signup, mapAuthError } from '@/services/authService'
import { isFirebaseConfigured } from '@/firebase/config'

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
      setError('لم يتم إعداد Firebase بعد. أضيفي بيانات المشروع في ملف .env')
      return
    }
    setError('')
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تتكون من ٨ أحرف على الأقل.')
      return
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      console.error('[athar] فشل إنشاء الحساب:', err)
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
          <h1 className="text-[24px] sm:text-[26px]">إنشاء حساب في أَثَر</h1>
          <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">
            ابدئي رحلتك: رتّبي يومك، اصنعي إنجازك، واتركي أثرًا.
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-4 bg-sand-tint text-sand-700 rounded-lg p-3.5 text-[12.5px] leading-relaxed">
              لم يتم إعداد Firebase بعد. أنشئي مشروعًا في Firebase Console وأضيفي بياناته إلى ملف .env
            </div>
          )}

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

          <p className="text-[12.5px] text-ink-500 mt-6 text-center">
            لديكِ حساب بالفعل؟{' '}
            <Link to="/login" className="text-teal-600 font-semibold no-underline">
              تسجيل الدخول
            </Link>
          </p>
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
