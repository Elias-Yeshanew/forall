"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
});
// POST /api/auth/register
router.post('/register', rateLimiter_1.authLimiter, (0, validate_1.validate)(registerSchema), auth_controller_1.register);
// POST /api/auth/login
router.post('/login', rateLimiter_1.authLimiter, (0, validate_1.validate)(loginSchema), auth_controller_1.login);
// POST /api/auth/refresh
router.post('/refresh', auth_controller_1.refresh);
// POST /api/auth/logout
router.post('/logout', auth_controller_1.logout);
// GET /api/auth/me  (requires valid JWT)
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map