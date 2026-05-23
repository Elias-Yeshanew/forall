"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chat.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/conversations', chat_controller_1.getConversations);
router.post('/conversations', (0, validate_1.validate)(zod_1.z.object({ listingId: zod_1.z.string() })), chat_controller_1.startConversation);
router.get('/conversations/:id/messages', chat_controller_1.getMessages);
router.post('/conversations/:id/messages', (0, validate_1.validate)(zod_1.z.object({ content: zod_1.z.string().min(1) })), chat_controller_1.sendMessage);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map