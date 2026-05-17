"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function startServer() {
    try {
        // Test DB connection
        await database_1.prisma.$connect();
        console.log('✅ Database connected');
        const server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`\n🚀 Forall API running`);
            console.log(`   Environment : ${env_1.env.NODE_ENV}`);
            console.log(`   Port        : ${env_1.env.PORT}`);
            console.log(`   Health      : http://localhost:${env_1.env.PORT}/health`);
            console.log(`   API Base    : http://localhost:${env_1.env.PORT}/api\n`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received — shutting down gracefully...`);
            server.close(async () => {
                await database_1.prisma.$disconnect();
                console.log('Database disconnected. Goodbye.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (err) {
        console.error('Failed to start server:', err);
        await database_1.prisma.$disconnect();
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map