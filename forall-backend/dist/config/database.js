"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/config/database.ts
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: env_1.env.IS_PROD ? ['error'] : ['query', 'error', 'warn'],
    });
if (!env_1.env.IS_PROD)
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map