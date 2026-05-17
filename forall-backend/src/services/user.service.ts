// src/services/user.service.ts
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { env } from '../config/env'

const SAFE_SELECT = { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }

export async function getAllUsersService() {
  return prisma.user.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'desc' } })
}

export async function createUserService(dto: {
  name: string; email: string; password: string; role: UserRole
}) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } })
  if (existing) throw new AppError('A user with this email already exists', 409)

  const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS)

  return prisma.user.create({
    data: { name: dto.name, email: dto.email.toLowerCase(), passwordHash, role: dto.role },
    select: SAFE_SELECT,
  })
}

export async function updateUserService(
  id: string,
  dto: { name?: string; role?: UserRole; isActive?: boolean }
) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('User not found', 404)

  return prisma.user.update({ where: { id }, data: dto, select: SAFE_SELECT })
}

export async function deleteUserService(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('User not found', 404)
  await prisma.user.delete({ where: { id } })
}
