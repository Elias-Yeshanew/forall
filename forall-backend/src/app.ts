// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'

import { env } from './config/env'
import { defaultLimiter } from './middleware/rateLimiter'
import { errorHandler, notFound } from './middleware/errorHandler'

import authRoutes    from './routes/auth.routes'
import listingRoutes from './routes/listing.routes'
import contactRoutes from './routes/contact.routes'
import userRoutes    from './routes/user.routes'
import chatRoutes    from './routes/chat.routes'

const app = express()

// ─── Security ────────────────────────────────────────────────────────────────
app.use(
  helmet({
    // Frontend runs on a different origin in dev (localhost:3000),
    // so uploaded images from API origin (localhost:5000) must be embeddable.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
app.use(cors({
  origin: env.IS_PROD ? env.CLIENT_URL : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan(env.IS_PROD ? 'combined' : 'dev'))
app.use(defaultLimiter)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'forall-api', env: env.NODE_ENV })
})

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
      chat: [
        'GET /api/chat/conversations',
        'POST /api/chat/conversations',
        'GET /api/chat/conversations/:id/messages',
        'POST /api/chat/conversations/:id/messages',
      ]
    },
  })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/users',    userRoutes)
app.use('/api/chat',     chatRoutes)

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
