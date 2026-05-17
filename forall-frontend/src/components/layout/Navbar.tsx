'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t, i18n } = useTranslation('nav')
  const lang = i18n.language

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  const navLinks = [
    { href: '/', label: t('home', 'Home') },
    { href: '/listings', label: t('listings', 'Listings') },
    { href: '/post', label: t('post', 'Post Listing') },
  ]

  const roleBadgeClass =
    user?.role === 'admin'
      ? 'bg-red-600/15 text-red-400 border border-red-600/25'
      : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/25'

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="font-['Playfair_Display'] text-2xl font-bold tracking-widest text-[#C9A84C]">
          FOR<span className="text-[#F5F0E8] font-normal">ALL</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'btn-ghost text-sm',
                pathname === l.href && 'text-[#C9A84C]'
              )}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={cn('btn-ghost text-sm flex items-center gap-1.5', pathname.startsWith('/dashboard') && 'text-[#C9A84C]')}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/chat"
                className={cn('btn-ghost text-sm flex items-center gap-1.5', pathname.startsWith('/chat') && 'text-[#C9A84C]')}
              >
                Messages
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(lang === 'en' ? 'am' : 'en')}
            className="text-xs text-[#8A8070] hover:text-[#C9A84C] border border-[#C9A84C]/20 px-2.5 py-1 rounded transition-colors"
          >
            {lang === 'en' ? 'አማ' : 'EN'}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', roleBadgeClass)}>
                {user?.role === 'admin' ? 'Admin' : 'Sales'}
              </span>
              <span className="text-xs text-[#8A8070]">{user?.name}</span>
              <button onClick={handleLogout} className="btn-ghost p-2">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t('loginTitle', { ns: 'auth', defaultValue: 'Staff Login' })}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#C8C0B0] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#C9A84C]/15 bg-[#111] px-4 py-4 flex flex-col gap-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn('text-sm px-3 py-2 rounded text-[#C8C0B0] hover:text-[#C9A84C]', pathname === l.href && 'text-[#C9A84C]')}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm px-3 py-2 rounded text-[#C8C0B0] hover:text-[#C9A84C]">
                Dashboard
              </Link>
              <Link href="/chat" onClick={() => setMobileOpen(false)} className="text-sm px-3 py-2 rounded text-[#C8C0B0] hover:text-[#C9A84C]">
                Messages
              </Link>
              <button onClick={handleLogout} className="text-sm px-3 py-2 text-left text-red-400 hover:text-red-300">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center mt-2">
              Staff Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
