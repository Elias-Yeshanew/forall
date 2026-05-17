// src/middleware/roleGuard.ts
import { Request, Response, NextFunction } from 'express'
import { UserRole } from '@prisma/client'
import { AppError } from './errorHandler'

/**
 * Middleware factory: restrict route to specific roles.
 * Must be used AFTER authenticate().
 *
 * Usage:
 *   router.get('/poster', authenticate, requireRole('admin','sales'), controller)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}`,
          403
        )
      )
    }
    next()
  }
}

// Convenience helpers
export const adminOnly = requireRole('admin')
export const staffOnly = requireRole('admin', 'sales')
