import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthPageShell } from '@/components/layout/AuthPageShell'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { confirmPasswordReset, mapAuthError } from '@/services/authService'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const code = searchParams.get('oobCode') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تتكون من ٨ أحرف على الأقل.')
      return
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }
    if (!code) {
      setError('الرابط غير صالح، اطلبي رابطًا جديدًا لاستعادة كلمة المرور.')
      return
    }
    setLoading(true)
    try {
      await confirmPasswordReset(code, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(mapAuthError(err?.code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell>
        <h1 className="text-[23px]">تعيين كلمة مرور جديدة</h1>

        {done ? (
          <div className="mt-6 bg-success-tint text-success-700 rounded-lg p-4 text-[13.5px] leading-relaxed">
            تم تحديث كلمة المرور بنجاح، سيتم تحويلك إلى تسجيل الدخول.
          </div>
        ) : (
          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <Field label="كلمة المرور الجديدة">
              <Input
                type="password"
                icon={<Icon name="lock" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Field label="تأكيد كلمة المرور">
              <Input
                type="password"
                icon={<Icon name="lock" />}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </Field>
            {error && <p className="text-[12.5px] text-crit-600">{error}</p>}
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'جارٍ الحفظ…' : 'حفظ كلمة المرور'}
            </Button>
          </form>
        )}

        <Link to="/login" className="block text-center mt-6 text-[12.5px] text-teal-600 font-semibold no-underline">
          الرجوع إلى تسجيل الدخول
        </Link>
    </AuthPageShell>
  )
}
