"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
exports.loginService = loginService;
exports.refreshTokenService = refreshTokenService;
exports.getMeService = getMeService;
// src/services/auth.service.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const jwt_1 = require("../utils/jwt");
function toSafeUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}
async function registerService(name, email, password, phone) {
    const existingUser = await database_1.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
        throw new errorHandler_1.AppError('Email is already registered', 400);
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await database_1.prisma.user.create({
        data: {
            name,
            email: email.toLowerCase().trim(),
            passwordHash,
            phone,
            role: 'client'
        }
    });
    const tokens = (0, jwt_1.generateTokenPair)(user);
    return { user: toSafeUser(user), tokens };
}
async function loginService(email, password) {
    const user = await database_1.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.isActive) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    const passwordMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!passwordMatch) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    const tokens = (0, jwt_1.generateTokenPair)(user);
    return { user: toSafeUser(user), tokens };
}
async function refreshTokenService(refreshToken) {
    let payload;
    try {
        payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    }
    catch {
        throw new errorHandler_1.AppError('Invalid or expired refresh token', 401);
    }
    const user = await database_1.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
        throw new errorHandler_1.AppError('User not found', 401);
    }
    const tokens = (0, jwt_1.generateTokenPair)(user);
    return { user: toSafeUser(user), tokens };
}
async function getMeService(userId) {
    const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    return toSafeUser(user);
}
//# sourceMappingURL=auth.service.js.map