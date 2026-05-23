// src/server.ts
import { Server } from 'socket.io'
import http from 'http'
import app from './app'
import { env } from './config/env'
import { prisma } from './config/database'

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect()
    console.log('✅ Database connected')

    const server = http.createServer(app)
    const io = new Server(server, {
      cors: {
        origin: env.IS_PROD ? env.CLIENT_URL : true,
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    // Store io globally for controllers
    ;(global as any).io = io

    io.on('connection', (socket) => {
      console.log('Socket client connected:', socket.id)

      socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`)
        console.log(`Socket ${socket.id} joined conversation_${conversationId}`)
      })

      socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`)
      })

      socket.on('disconnect', () => {
        console.log('Socket client disconnected:', socket.id)
      })
    })

    server.listen(env.PORT, () => {
      console.log(`\n🚀 Forall API running`)
      console.log(`   Environment : ${env.NODE_ENV}`)
      console.log(`   Database    : ${env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`)
      console.log(`   Port        : ${env.PORT}`)
      console.log(`   Health      : http://localhost:${env.PORT}/health`)
      console.log(`   API Base    : http://localhost:${env.PORT}/api\n`)
    })

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received — shutting down gracefully...`)
      server.close(async () => {
        await prisma.$disconnect()
        console.log('Database disconnected. Goodbye.')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT',  () => shutdown('SIGINT'))

  } catch (err) {
    console.error('Failed to start server:', err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()
