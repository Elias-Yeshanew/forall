"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const roleGuard_1 = require("../middleware/roleGuard");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['admin', 'sales']),
});
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.enum(['admin', 'sales']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// All user routes require admin role
router.use(auth_middleware_1.authenticate, roleGuard_1.adminOnly);
router.get('/', user_controller_1.getUsers);
router.post('/', (0, validate_1.validate)(createSchema), user_controller_1.createUser);
router.put('/:id', (0, validate_1.validate)(updateSchema), user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map