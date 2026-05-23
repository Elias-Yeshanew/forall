"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingsService = getListingsService;
exports.getListingsAdminService = getListingsAdminService;
exports.getListingByIdService = getListingByIdService;
exports.getPosterDetailsService = getPosterDetailsService;
exports.createListingService = createListingService;
exports.updateListingService = updateListingService;
exports.updateListingStatusService = updateListingStatusService;
exports.deleteListingService = deleteListingService;
exports.getListingStatsService = getListingStatsService;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const pagination_1 = require("../utils/pagination");
const slugify_1 = require("../utils/slugify");
// Fields returned to PUBLIC (no poster info)
const PUBLIC_SELECT = {
    id: true, type: true, title: true, slug: true, description: true,
    price: true, location: true, city: true, status: true,
    images: true, viewCount: true, createdAt: true, updatedAt: true,
    carDetails: true,
    houseDetails: true,
    poster: false, // ← never exposed publicly
};
// Fields returned to STAFF (includes poster)
const STAFF_SELECT = {
    ...PUBLIC_SELECT,
    poster: true, // ← only for admin/sales
};
function buildWhereClause(filters) {
    const where = {};
    if (filters.type)
        where.type = filters.type;
    if (filters.status)
        where.status = filters.status;
    if (filters.city)
        where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { location: { contains: filters.search, mode: 'insensitive' } },
            { city: { contains: filters.search, mode: 'insensitive' } },
        ];
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined)
            where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined)
            where.price.lte = filters.maxPrice;
    }
    return where;
}
// ─── PUBLIC: listings without poster info ───────────────────────────────────
async function getListingsService(filters) {
    const { page, limit, skip } = (0, pagination_1.getPagination)(filters);
    const where = buildWhereClause({ ...filters, status: filters.status ?? 'active' });
    const [data, total] = await Promise.all([
        database_1.prisma.listing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: PUBLIC_SELECT }),
        database_1.prisma.listing.count({ where }),
    ]);
    // return buildPaginatedResult(data, total, page, limit)
    return { data, total };
}
// ─── STAFF: listings WITH poster info ───────────────────────────────────────
async function getListingsAdminService(filters) {
    const { page, limit, skip } = (0, pagination_1.getPagination)(filters);
    const where = buildWhereClause(filters); // no default status filter for staff
    const [data, total] = await Promise.all([
        database_1.prisma.listing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: STAFF_SELECT }),
        database_1.prisma.listing.count({ where }),
    ]);
    return (0, pagination_1.buildPaginatedResult)(data, total, page, limit);
}
// ─── PUBLIC: single listing (no poster) ─────────────────────────────────────
async function getListingByIdService(id) {
    const listing = await database_1.prisma.listing.findUnique({ where: { id }, select: PUBLIC_SELECT });
    if (!listing)
        throw new errorHandler_1.AppError('Listing not found', 404);
    // Increment view count (fire and forget)
    database_1.prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => { });
    return listing;
}
// ─── STAFF ONLY: get poster contact details ─────────────────────────────────
async function getPosterDetailsService(listingId) {
    const poster = await database_1.prisma.poster.findUnique({ where: { listingId } });
    if (!poster)
        throw new errorHandler_1.AppError('Poster details not found', 404);
    return poster;
}
// ─── PUBLIC: create listing ──────────────────────────────────────────────────
async function createListingService(dto, userId) {
    const slug = await (0, slugify_1.generateUniqueSlug)(dto.title);
    const listing = await database_1.prisma.listing.create({
        data: {
            userId,
            type: dto.type,
            title: dto.title,
            slug,
            description: dto.description,
            price: dto.price,
            location: dto.location,
            city: dto.city,
            images: dto.images ?? [],
            status: 'pending', // always starts as pending for review
            ...(dto.poster && { poster: { create: dto.poster } }),
            ...(dto.carDetails && { carDetails: { create: dto.carDetails } }),
            ...(dto.houseDetails && { houseDetails: { create: dto.houseDetails } }),
        },
        select: PUBLIC_SELECT,
    });
    return listing;
}
// ─── STAFF: update listing ───────────────────────────────────────────────────
async function updateListingService(id, dto) {
    const listing = await database_1.prisma.listing.findUnique({ where: { id } });
    if (!listing)
        throw new errorHandler_1.AppError('Listing not found', 404);
    return database_1.prisma.listing.update({ where: { id }, data: dto, select: STAFF_SELECT });
}
// ─── STAFF: update status only ───────────────────────────────────────────────
async function updateListingStatusService(id, status) {
    const validStatuses = ['pending', 'active', 'sold', 'rented'];
    if (!validStatuses.includes(status))
        throw new errorHandler_1.AppError('Invalid status', 400);
    const listing = await database_1.prisma.listing.findUnique({ where: { id } });
    if (!listing)
        throw new errorHandler_1.AppError('Listing not found', 404);
    return database_1.prisma.listing.update({
        where: { id },
        data: { status: status },
        select: STAFF_SELECT,
    });
}
// ─── ADMIN: delete listing ───────────────────────────────────────────────────
async function deleteListingService(id) {
    const listing = await database_1.prisma.listing.findUnique({ where: { id } });
    if (!listing)
        throw new errorHandler_1.AppError('Listing not found', 404);
    await database_1.prisma.listing.delete({ where: { id } });
}
// ─── STATS ───────────────────────────────────────────────────────────────────
async function getListingStatsService() {
    const [total, cars, houses, pending] = await Promise.all([
        database_1.prisma.listing.count(),
        database_1.prisma.listing.count({ where: { type: 'car' } }),
        database_1.prisma.listing.count({ where: { type: 'house' } }),
        database_1.prisma.listing.count({ where: { status: 'pending' } }),
    ]);
    return { total, cars, houses, pending };
}
//# sourceMappingURL=listing.service.js.map