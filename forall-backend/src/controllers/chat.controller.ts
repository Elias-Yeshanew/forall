// src/controllers/chat.controller.ts
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!
    let whereClause = {}
    if (user.role === 'client') {
      whereClause = { clientId: user.id }
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        listing: { select: { id: true, title: true, images: true } },
        client: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.json({ status: 'success', data: conversations })
  } catch (err) { next(err) }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    })

    if (!conversation) throw new AppError('Conversation not found', 404)

    if (req.user!.role === 'client' && conversation.clientId !== req.user!.id) {
      throw new AppError('Forbidden', 403)
    }

    // Mark messages as read if accessed by the other party
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: req.user!.id },
        isRead: false
      },
      data: { isRead: true }
    })

    res.json({ status: 'success', data: conversation.messages })
  } catch (err) { next(err) }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { content } = req.body

    const conversation = await prisma.conversation.findUnique({ where: { id } })
    if (!conversation) throw new AppError('Conversation not found', 404)

    if (req.user!.role === 'client' && conversation.clientId !== req.user!.id) {
      throw new AppError('Forbidden', 403)
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: id,
        senderId: req.user!.id
      }
    })

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    })

    // Store in global so socket can access it
    if ((global as any).io) {
      (global as any).io.to(`conversation_${id}`).emit('receive_message', message)
    }

    res.status(201).json({ status: 'success', data: message })
  } catch (err) { next(err) }
}

export async function startConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { listingId } = req.body
    const clientId = req.user!.id

    // Check if listing exists and belongs to the client
    const listing = await prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing) throw new AppError('Listing not found', 404)

    let conversation = await prisma.conversation.findUnique({
      where: {
        listingId_clientId: {
          listingId,
          clientId
        }
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId,
          clientId
        }
      })
    }

    res.status(201).json({ status: 'success', data: conversation })
  } catch (err) { next(err) }
}
