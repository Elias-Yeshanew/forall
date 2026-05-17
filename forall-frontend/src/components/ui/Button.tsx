'use client'
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      gold: 'bg-[#C9A84C] text-black hover:bg-[#E8D5A3]',
      outline: 'bg-transparent text-[#C9A84C] border border-[#C9A84C]/40 hover:bg-[#C9A84C]/10',
      ghost: 'bg-transparent text-[#C8C0B0] hover:text-[#C9A84C] hover:bg-[#C9A84C]/8',
      danger: 'bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20',
    }
    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-7 py-3.5',
      icon: 'p-2 w-10 h-10',
    }
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
