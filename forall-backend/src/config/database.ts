// src/config/database.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { env } from './env'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.IS_PROD ? ['error'] : ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  })

if (!env.IS_PROD) globalForPrisma.prisma = prisma

// Configure pg Pool for raw queries or custom connections (e.g. Neon SSL support)
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.IS_PROD
    ? {
        rejectUnauthorized: false, // This allows the connection to Neon in production
      }
    : undefined,
})

export default prisma
