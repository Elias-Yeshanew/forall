"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/contact.routes.ts
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const roleGuard_1 = require("../middleware/roleGuard");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const submitSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(9).regex(/^\+?[0-9\s\-()]+$/),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    message: zod_1.z.string().min(10).max(1000),
    listingId: zod_1.z.string().min(1),
});
const updateSchema = zod_1.z.object({
    status: zod_1.z.enum(['unread', 'read', 'replied']),
    assignedTo: zod_1.z.string().optional(),
});
// POST /api/contacts         — public: submit inquiry (routes to sales team)
router.post('/', rateLimiter_1.postLimiter, (0, validate_1.validate)(submitSchema), contact_controller_1.submitContact);
// GET  /api/contacts         — staff only: view all inquiries
router.get('/', auth_middleware_1.authenticate, roleGuard_1.staffOnly, contact_controller_1.getContacts);
// GET  /api/contacts/stats   — staff only
router.get('/stats', auth_middleware_1.authenticate, roleGuard_1.staffOnly, contact_controller_1.getContactStats);
// PATCH /api/contacts/:id    — staff only: update status
router.patch('/:id', auth_middleware_1.authenticate, roleGuard_1.staffOnly, (0, validate_1.validate)(updateSchema), contact_controller_1.updateContact);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map