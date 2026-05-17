'use client'
// src/app/(auth)/register/page.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { t } = useTranslation('auth')
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      toast.success('Account created successfully!')
      router.replace('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-widest text-[#C9A84C] mb-12">
        FOR<span className="text-[#F5F0E8] font-normal">ALL</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-[#1A1A1A] border border-[#C9A84C]/25 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-xl mb-4">
              <UserPlus className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <h1 className="font-['Playfair_Display'] text-xl text-[#F5F0E8] mb-1">{t('registerTitle', 'Create an Account')}</h1>
            <p className="text-xs text-[#8A8070]">{t('registerSubtitle', 'Join to post and manage listings')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={t('fullName', 'Full Name')}
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label={t('email', 'Email Address')}
              type="email"
              placeholder="user@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('phone', 'Phone Number')}
              type="text"
              placeholder="+251 911 000000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label={t('password', 'Password')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              {t('registerBtn', 'Sign Up')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8A8070] mt-6 flex flex-col gap-2">
          <span>
            {t('hasAccount', "Already have an account?")} {' '}
            <Link href="/login" className="text-[#C9A84C] hover:underline">
              {t('loginNow', 'Sign In')}
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
