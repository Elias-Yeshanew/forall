// src/types/user.ts

export type UserRole = 'admin' | 'sales' | 'client'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: UserRole
}
