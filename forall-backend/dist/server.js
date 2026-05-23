"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function startServer() {
    try {
        // Test DB connection
        await database_1.prisma.$connect();
        console.log('✅ Database connected');
        const server = http_1.default.createServer(app_1.default);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: env_1.env.IS_PROD ? env_1.env.CLIENT_URL : true,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        global.io = io;
        io.on('connection', (socket) => {
            console.log('Socket client connected:', socket.id);
            socket.on('join_conversation', (conversationId) => {
                socket.join(`conversation_${conversationId}`);
                console.log(`Socket ${socket.id} joined conversation_${conversationId}`);
            });
            socket.on('leave_conversation', (conversationId) => {
                socket.leave(`conversation_${conversationId}`);
            });
            socket.on('disconnect', () => {
                console.log('Socket client disconnected:', socket.id);
            });
        });
        server.listen(env_1.env.PORT, () => {
            console.log(`\n🚀 Forall API running`);
            console.log(`   Environment : ${env_1.env.NODE_ENV}`);
            console.log(`   Database    : ${env_1.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);
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