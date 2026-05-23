"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.prisma = void 0;
// src/config/database.ts
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const env_1 = require("./env");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: env_1.env.IS_PROD ? ['error'] : ['query', 'error', 'warn'],
        datasources: {
            db: {
                url: env_1.env.DATABASE_URL,
            },
        },
    });
if (!env_1.env.IS_PROD)
    globalForPrisma.prisma = exports.prisma;
// Configure pg Pool for raw queries or custom connections (e.g. Neon SSL support)
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    ssl: env_1.env.IS_PROD
        ? {
            rejectUnauthorized: false, // This allows the connection to Neon in production
        }
        : undefined,
});
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map