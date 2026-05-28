// src/routes/auth.routes.ts
import { Router } from 'express'
import { login, logout, refresh, getMe, register, googleLogin } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate'
import { authLimiter } from '../middleware/rateLimiter'
import { z } from 'zod'

const router = Router()

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
  phone:    z.string().optional(),
})

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), register)

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), login)

// POST /api/auth/google
router.post('/google', authLimiter, googleLogin)

// POST /api/auth/refresh
router.post('/refresh', refresh)

// POST /api/auth/logout
router.post('/logout', logout)

// GET /api/auth/me  (requires valid JWT)
router.get('/me', authenticate, getMe)

export default router
