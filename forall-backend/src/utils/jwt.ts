// src/utils/jwt.ts
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JwtPayload, TokenPair } from '../types/auth'
import { UserRole } from '@prisma/client'

export function signAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string }
}

export function generateTokenPair(user: {
  id: string
  email: string
  role: UserRole
  name: string
}): TokenPair {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
  const refreshToken = signRefreshToken(user.id)
  return { accessToken, refreshToken }
}
