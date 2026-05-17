"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("./errorHandler");
function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errorHandler_1.AppError('Authentication required', 401);
        }
        const token = authHeader.slice(7);
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            name: payload.name,
        };
        next();
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError)
            return next(err);
        next(new errorHandler_1.AppError('Invalid or expired token', 401));
    }
}
//# sourceMappingURL=auth.middleware.js.map