'use client'
// src/app/(auth)/login/page.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      router.replace('/dashboard')
    } catch {
      toast.error('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-widest text-[#C9A84C] mb-12">
        FOR<span className="text-[#F5F0E8] font-normal">ALL</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-[#1A1A1A] border border-[#C9A84C]/25 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-xl mb-4">
              <ShieldCheck className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <h1 className="font-['Playfair_Display'] text-xl text-[#F5F0E8] mb-1">{t('loginTitle', 'Welcome Back')}</h1>
            <p className="text-xs text-[#8A8070]">{t('loginSubtitle', 'Sign in to manage your account and listings')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={t('email', 'Email Address')}
              type="email"
              placeholder="staff@forall.et"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('password', 'Password')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              {t('loginBtn', 'Sign In')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8A8070] mt-6 flex flex-col gap-2">
          <span>
            {t('noAccount', "Don't have an account?")} {' '}
            <Link href="/register" className="text-[#C9A84C] hover:underline">
              {t('registerNow', 'Register Now')}
            </Link>
          </span>
          <span>
            <Link href="/" className="text-[#C9A84C] hover:underline">
              {t('backToHome', 'Back to Home')}
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
