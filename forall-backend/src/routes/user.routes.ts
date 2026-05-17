// src/routes/user.routes.ts
import { Router } from 'express'
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'
import { adminOnly } from '../middleware/roleGuard'
import { validate } from '../middleware/validate'
import { z } from 'zod'

const router = Router()

const createSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
  role:     z.enum(['admin', 'sales']),
})

const updateSchema = z.object({
  name:     z.string().min(2).optional(),
  role:     z.enum(['admin', 'sales']).optional(),
  isActive: z.boolean().optional(),
})

// All user routes require admin role
router.use(authenticate, adminOnly)

router.get('/',      getUsers)
router.post('/',     validate(createSchema), createUser)
router.put('/:id',   validate(updateSchema), updateUser)
router.delete('/:id', deleteUser)

export default router
