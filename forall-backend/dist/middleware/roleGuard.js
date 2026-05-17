"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffOnly = exports.adminOnly = void 0;
exports.requireRole = requireRole;
const errorHandler_1 = require("./errorHandler");
/**
 * Middleware factory: restrict route to specific roles.
 * Must be used AFTER authenticate().
 *
 * Usage:
 *   router.get('/poster', authenticate, requireRole('admin','sales'), controller)
 */
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
        }
        next();
    };
}
// Convenience helpers
exports.adminOnly = requireRole('admin');
exports.staffOnly = requireRole('admin', 'sales');
//# sourceMappingURL=roleGuard.js.map