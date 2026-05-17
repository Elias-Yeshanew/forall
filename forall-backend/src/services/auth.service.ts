// src/services/auth.service.ts
import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt'
import { SafeUser, TokenPair } from '../types/auth'

function toSafeUser(user: {
  id: string; name: string; email: string
  role: any; createdAt: Date
}): SafeUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
}

export async function registerService(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existingUser) {
    throw new AppError('Email is already registered', 400)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      phone,
      role: 'client'
    }
  })

  const tokens = generateTokenPair(user)
  return { user: toSafeUser(user), tokens }
}

export async function loginService(
  email: string,
  password: string
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401)
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401)
  }

  const tokens = generateTokenPair(user)
  return { user: toSafeUser(user), tokens }
}

export async function refreshTokenService(
  refreshToken: string
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  let payload: { sub: string }
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new AppError('Invalid or expired refresh token', 401)
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || !user.isActive) {
    throw new AppError('User not found', 401)
  }

  const tokens = generateTokenPair(user)
  return { user: toSafeUser(user), tokens }
}

export async function getMeService(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError('User not found', 404)
  return toSafeUser(user)
}
