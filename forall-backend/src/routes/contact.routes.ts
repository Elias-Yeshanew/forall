// src/routes/contact.routes.ts
import { Router } from 'express'
import {
  submitContact, getContacts,
  updateContact, getContactStats,
} from '../controllers/contact.controller'
import { authenticate } from '../middleware/auth.middleware'
import { staffOnly } from '../middleware/roleGuard'
import { validate } from '../middleware/validate'
import { postLimiter } from '../middleware/rateLimiter'
import { z } from 'zod'

const router = Router()

const submitSchema = z.object({
  name:      z.string().min(2),
  phone:     z.string().min(9).regex(/^\+?[0-9\s\-()]+$/),
  email:     z.string().email().optional().or(z.literal('')),
  message:   z.string().min(10).max(1000),
  listingId: z.string().min(1),
})

const updateSchema = z.object({
  status:     z.enum(['unread', 'read', 'replied']),
  assignedTo: z.string().optional(),
})

// POST /api/contacts         — public: submit inquiry (routes to sales team)
router.post('/', postLimiter, validate(submitSchema), submitContact)

// GET  /api/contacts         — staff only: view all inquiries
router.get('/', authenticate, staffOnly, getContacts)

// GET  /api/contacts/stats   — staff only
router.get('/stats', authenticate, staffOnly, getContactStats)

// PATCH /api/contacts/:id    — staff only: update status
router.patch('/:id', authenticate, staffOnly, validate(updateSchema), updateContact)

export default router
