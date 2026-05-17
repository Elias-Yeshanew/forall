"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactService = createContactService;
exports.getContactsService = getContactsService;
exports.updateContactService = updateContactService;
exports.getContactStatsService = getContactStatsService;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const pagination_1 = require("../utils/pagination");
const email_service_1 = require("./email.service");
async function createContactService(dto) {
    // Verify listing exists
    const listing = await database_1.prisma.listing.findUnique({
        where: { id: dto.listingId },
        select: { id: true, title: true, status: true },
    });
    if (!listing)
        throw new errorHandler_1.AppError('Listing not found', 404);
    if (listing.status !== 'active')
        throw new errorHandler_1.AppError('This listing is no longer active', 400);
    const contact = await database_1.prisma.contact.create({
        data: {
            name: dto.name,
            phone: dto.phone,
            email: dto.email,
            message: dto.message,
            listingId: dto.listingId,
            status: 'unread',
        },
        include: { listing: { select: { title: true } } },
    });
    // Notify sales team by email (fire and forget)
    email_service_1.emailService.notifySalesTeam({
        customerName: contact.name,
        customerPhone: contact.phone,
        customerEmail: contact.email,
        message: contact.message,
        listingTitle: listing.title,
        listingId: listing.id,
    }).catch(console.error);
    return contact;
}
async function getContactsService(params) {
    const { page, limit, skip } = (0, pagination_1.getPagination)(params);
    const where = params.status ? { status: params.status } : {};
    const [data, total, unread] = await Promise.all([
        database_1.prisma.contact.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { listing: { select: { title: true, type: true } } },
        }),
        database_1.prisma.contact.count({ where }),
        database_1.prisma.contact.count({ where: { status: 'unread' } }),
    ]);
    return { ...(0, pagination_1.buildPaginatedResult)(data, total, page, limit), unread };
}
async function updateContactService(id, dto) {
    const contact = await database_1.prisma.contact.findUnique({ where: { id } });
    if (!contact)
        throw new errorHandler_1.AppError('Contact not found', 404);
    return database_1.prisma.contact.update({
        where: { id },
        data: dto,
        include: { listing: { select: { title: true } } },
    });
}
async function getContactStatsService() {
    const [total, unread, replied] = await Promise.all([
        database_1.prisma.contact.count(),
        database_1.prisma.contact.count({ where: { status: 'unread' } }),
        database_1.prisma.contact.count({ where: { status: 'replied' } }),
    ]);
    return { total, unread, replied };
}
//# sourceMappingURL=contact.service.js.map