// src/routes/chat.routes.ts
import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { getConversations, getMessages, sendMessage, startConversation } from '../controllers/chat.controller'
import { validate } from '../middleware/validate'
import { z } from 'zod'

const router = Router()

router.use(authenticate)

router.get('/conversations', getConversations)
router.post('/conversations', validate(z.object({ listingId: z.string() })), startConversation)
router.get('/conversations/:id/messages', getMessages)
router.post('/conversations/:id/messages', validate(z.object({ content: z.string().min(1) })), sendMessage)

export default router
