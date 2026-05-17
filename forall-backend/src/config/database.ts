// src/config/database.ts
import { PrismaClient } from '@prisma/client'
import { env } from './env'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.IS_PROD ? ['error'] : ['query', 'error', 'warn'],
  })

if (!env.IS_PROD) globalForPrisma.prisma = prisma

export default prisma
