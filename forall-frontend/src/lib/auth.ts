// src/lib/auth.ts
import Cookies from 'js-cookie'
import { User } from '@/types/user'

const TOKEN_KEY = 'forall_token'
const USER_KEY = 'forall_user'

export const tokenStorage = {
  get: (): string | undefined => Cookies.get(TOKEN_KEY),

  set: (token: string, rememberMe = false): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: rememberMe ? 30 : 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  },

  remove: (): void => {
    Cookies.remove(TOKEN_KEY)
    if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY)
  },
}

export const userStorage = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },

  set: (user: User): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_KEY)
  },
}

export const isAuthenticated = (): boolean => !!tokenStorage.get()

export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false
  return roles.includes(user.role)
}

export const canViewPosterDetails = (user: User | null): boolean =>
  hasRole(user, ['admin', 'sales'])

export const isAdmin = (user: User | null): boolean =>
  hasRole(user, ['admin'])
