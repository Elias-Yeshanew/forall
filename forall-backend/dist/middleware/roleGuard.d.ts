import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
/**
 * Middleware factory: restrict route to specific roles.
 * Must be used AFTER authenticate().
 *
 * Usage:
 *   router.get('/poster', authenticate, requireRole('admin','sales'), controller)
 */
export declare function requireRole(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: Request, _res: Response, next: NextFunction) => void;
export declare const staffOnly: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleGuard.d.ts.map