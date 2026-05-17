'use client'
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, AuthState } from '@/types/user'
import { authApi } from '@/lib/api'
import { tokenStorage, userStorage } from '@/lib/auth'

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get()
    if (!token) {
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
      return
    }
    try {
      const user = await authApi.me()
      userStorage.set(user)
      setState({ user, token, isAuthenticated: true, isLoading: false })
    } catch {
      tokenStorage.remove()
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  useEffect(() => {
    const token = tokenStorage.get()
    const cachedUser = userStorage.get()
    if (token && cachedUser) {
      setState({ user: cachedUser, token, isAuthenticated: true, isLoading: false })
      refreshUser()
    } else {
      refreshUser()
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password })
    tokenStorage.set(token)
    userStorage.set(user)
    setState({ user, token, isAuthenticated: true, isLoading: false })
  }, [])

  const register = useCallback(async (data: any) => {
    const { user, token } = await authApi.register(data)
    tokenStorage.set(token)
    userStorage.set(user)
    setState({ user, token, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } finally {
      tokenStorage.remove()
      userStorage.remove()
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
