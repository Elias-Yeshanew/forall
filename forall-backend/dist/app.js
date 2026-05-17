"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const listing_routes_1 = __importDefault(require("./routes/listing.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
// ─── Security ────────────────────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    // Frontend runs on a different origin in dev (localhost:3000),
    // so uploaded images from API origin (localhost:5000) must be embeddable.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ─── Middleware ───────────────────────────────────────────────────────────────
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(env_1.env.IS_PROD ? 'combined' : 'dev'));
app.use(rateLimiter_1.defaultLimiter);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'forall-api', env: env_1.env.NODE_ENV });
});
app.get('/api', (_req, res) => {
    res.json({
        message: 'Forall API',
        endpoints: {
            health: ['GET /health'],
            auth: [
                'POST /api/auth/login',
                'POST /api/auth/refresh',
                'POST /api/auth/logout',
                'GET /api/auth/me',
            ],
            listings: [
                'GET /api/listings',
                'GET /api/listings/stats',
                'GET /api/listings/:id',
                'POST /api/listings',
                'POST /api/listings/upload',
                'GET /api/listings/admin',
                'GET /api/listings/:id/poster',
                'PUT /api/listings/:id',
                'PATCH /api/listings/:id/status',
                'DELETE /api/listings/:id',
            ],
            contacts: [
                'POST /api/contacts',
                'GET /api/contacts',
                'GET /api/contacts/stats',
                'PATCH /api/contacts/:id',
            ],
            users: [
                'GET /api/users',
                'POST /api/users',
                'PUT /api/users/:id',
                'DELETE /api/users/:id',
            ],
        },
    });
});
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/listings', listing_routes_1.default);
app.use('/api/contacts', contact_routes_1.default);
app.use('/api/users', user_routes_1.default);
// ─── Error handling ───────────────────────────────────────────────────────────
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map