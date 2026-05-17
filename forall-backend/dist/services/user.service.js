"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersService = getAllUsersService;
exports.createUserService = createUserService;
exports.updateUserService = updateUserService;
exports.deleteUserService = deleteUserService;
// src/services/user.service.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const env_1 = require("../config/env");
const SAFE_SELECT = { id: true, name: true, email: true, role: true, isActive: true, createdAt: true };
async function getAllUsersService() {
    return database_1.prisma.user.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'desc' } });
}
async function createUserService(dto) {
    const existing = await database_1.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing)
        throw new errorHandler_1.AppError('A user with this email already exists', 409);
    const passwordHash = await bcryptjs_1.default.hash(dto.password, env_1.env.BCRYPT_ROUNDS);
    return database_1.prisma.user.create({
        data: { name: dto.name, email: dto.email.toLowerCase(), passwordHash, role: dto.role },
        select: SAFE_SELECT,
    });
}
async function updateUserService(id, dto) {
    const user = await database_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    return database_1.prisma.user.update({ where: { id }, data: dto, select: SAFE_SELECT });
}
async function deleteUserService(id) {
    const user = await database_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    await database_1.prisma.user.delete({ where: { id } });
}
//# sourceMappingURL=user.service.js.map