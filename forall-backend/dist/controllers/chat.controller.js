"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = getConversations;
exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
exports.startConversation = startConversation;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
async function getConversations(req, res, next) {
    try {
        const user = req.user;
        let whereClause = {};
        if (user.role === 'client') {
            whereClause = { clientId: user.id };
        }
        else if (user.role === 'sales') {
            whereClause = {
                OR: [
                    { assignedSalesId: null },
                    { assignedSalesId: user.id }
                ]
            };
        }
        const conversations = await database_1.prisma.conversation.findMany({
            where: whereClause,
            include: {
                listing: { select: { id: true, title: true, images: true } },
                client: { select: { id: true, name: true, email: true } },
                assignedSales: { select: { id: true, name: true, email: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ status: 'success', data: conversations });
    }
    catch (err) {
        next(err);
    }
}
async function getMessages(req, res, next) {
    try {
        const { id } = req.params;
        const conversation = await database_1.prisma.conversation.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        if (!conversation)
            throw new errorHandler_1.AppError('Conversation not found', 404);
        if (req.user.role === 'client' && conversation.clientId !== req.user.id) {
            throw new errorHandler_1.AppError('Forbidden', 403);
        }
        // Mark messages as read if accessed by the other party
        await database_1.prisma.message.updateMany({
            where: {
                conversationId: id,
                senderId: { not: req.user.id },
                isRead: false
            },
            data: { isRead: true }
        });
        res.json({ status: 'success', data: conversation.messages });
    }
    catch (err) {
        next(err);
    }
}
async function sendMessage(req, res, next) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const conversation = await database_1.prisma.conversation.findUnique({ where: { id } });
        if (!conversation)
            throw new errorHandler_1.AppError('Conversation not found', 404);
        if (req.user.role === 'client' && conversation.clientId !== req.user.id) {
            throw new errorHandler_1.AppError('Forbidden', 403);
        }
        const message = await database_1.prisma.message.create({
            data: {
                content,
                conversationId: id,
                senderId: req.user.id
            }
        });
        let assignedSalesId = conversation.assignedSalesId;
        if (req.user.role === 'sales' && !assignedSalesId) {
            await database_1.prisma.conversation.update({
                where: { id },
                data: {
                    assignedSalesId: req.user.id,
                    updatedAt: new Date()
                }
            });
            assignedSalesId = req.user.id;
        }
        else {
            await database_1.prisma.conversation.update({
                where: { id },
                data: { updatedAt: new Date() }
            });
        }
        // Emit socket updates real-time
        if (global.io) {
            const io = global.io;
            io.to(`conversation_${id}`).emit('receive_message', message);
            if (assignedSalesId) {
                io.to(`user_${assignedSalesId}`).emit('conversation_updated', { conversationId: id });
                io.to(`user_${conversation.clientId}`).emit('conversation_updated', { conversationId: id });
                io.to('role_sales').emit('conversation_updated', { conversationId: id });
            }
            else {
                io.to('role_sales').emit('conversation_updated', { conversationId: id });
                io.to(`user_${conversation.clientId}`).emit('conversation_updated', { conversationId: id });
            }
        }
        res.status(201).json({ status: 'success', data: message });
    }
    catch (err) {
        next(err);
    }
}
async function startConversation(req, res, next) {
    try {
        const { listingId } = req.body;
        const clientId = req.user.id;
        // Check if listing exists and belongs to the client
        const listing = await database_1.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing)
            throw new errorHandler_1.AppError('Listing not found', 404);
        let conversation = await database_1.prisma.conversation.findUnique({
            where: {
                listingId_clientId: {
                    listingId,
                    clientId
                }
            }
        });
        if (!conversation) {
            conversation = await database_1.prisma.conversation.create({
                data: {
                    listingId,
                    clientId
                }
            });
        }
        res.status(201).json({ status: 'success', data: conversation });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=chat.controller.js.map