// src/types/auth.ts
import { UserRole } from '@prisma/client'

export interface JwtPayload {
  sub: string      // user id
  email: string
  role: UserRole
  name: string
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface SafeUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}
