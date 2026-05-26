// src/services/listing.service.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { CreateListingDto, UpdateListingDto, ListingFilters } from '../types/listing'
import { getPagination, buildPaginatedResult } from '../utils/pagination'
import { generateUniqueSlug } from '../utils/slugify'

// Fields returned to PUBLIC (no poster info)
const PUBLIC_SELECT = {
  id: true, type: true, title: true, slug: true, description: true,
  price: true, location: true, city: true, status: true,
  images: true, viewCount: true, createdAt: true, updatedAt: true,
  carDetails: true,
  houseDetails: true,
  poster: false,  // ← never exposed publicly
}

// Fields returned to STAFF (includes poster)
const STAFF_SELECT = {
  ...PUBLIC_SELECT,
  poster: true,   // ← only for admin/sales
}

function buildWhereClause(filters: ListingFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {}

  if (filters.type) where.type = filters.type
  if (filters.status) where.status = filters.status
  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { location: { contains: filters.search, mode: 'insensitive' } },
      { city: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
  }

  return where
}

// ─── PUBLIC: listings without poster info ───────────────────────────────────
export async function getListingsService(filters: ListingFilters) {
  const { page, limit, skip } = getPagination(filters)
  const where = buildWhereClause({ ...filters, status: filters.status ?? 'active' })

  const [data, total] = await Promise.all([
    prisma.listing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: PUBLIC_SELECT }),
    prisma.listing.count({ where }),
  ])

  return buildPaginatedResult(data, total, page, limit)
}

// ─── STAFF: listings WITH poster info ───────────────────────────────────────
export async function getListingsAdminService(filters: ListingFilters) {
  const { page, limit, skip } = getPagination(filters)
  const where = buildWhereClause(filters) // no default status filter for staff

  const [data, total] = await Promise.all([
    prisma.listing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: STAFF_SELECT }),
    prisma.listing.count({ where }),
  ])

  return buildPaginatedResult(data, total, page, limit)
}

// ─── PUBLIC: single listing (no poster) ─────────────────────────────────────
export async function getListingByIdService(id: string) {
  const listing = await prisma.listing.findUnique({ where: { id }, select: PUBLIC_SELECT })
  if (!listing) throw new AppError('Listing not found', 404)

  // Increment view count (fire and forget)
  prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => { })

  return listing
}

// ─── STAFF ONLY: get poster contact details ─────────────────────────────────
export async function getPosterDetailsService(listingId: string) {
  const poster = await prisma.poster.findUnique({ where: { listingId } })
  if (!poster) throw new AppError('Poster details not found', 404)
  return poster
}

// ─── PUBLIC: create listing ──────────────────────────────────────────────────
export async function createListingService(dto: CreateListingDto, userId: string) {
  const slug = await generateUniqueSlug(dto.title)

  const listing = await prisma.listing.create({
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
  })

  return listing
}

// ─── STAFF: update listing ───────────────────────────────────────────────────
export async function updateListingService(id: string, dto: UpdateListingDto) {
  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) throw new AppError('Listing not found', 404)

  return prisma.listing.update({ where: { id }, data: dto, select: STAFF_SELECT })
}

// ─── STAFF: update status only ───────────────────────────────────────────────
export async function updateListingStatusService(id: string, status: string) {
  const validStatuses = ['pending', 'active', 'sold', 'rented']
  if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400)

  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) throw new AppError('Listing not found', 404)

  return prisma.listing.update({
    where: { id },
    data: { status: status as any },
    select: STAFF_SELECT,
  })
}

// ─── ADMIN: delete listing ───────────────────────────────────────────────────
export async function deleteListingService(id: string) {
  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) throw new AppError('Listing not found', 404)
  await prisma.listing.delete({ where: { id } })
}

// ─── STATS ───────────────────────────────────────────────────────────────────
export async function getListingStatsService() {
  const [total, cars, houses, pending] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { type: 'car' } }),
    prisma.listing.count({ where: { type: 'house' } }),
    prisma.listing.count({ where: { status: 'pending' } }),
  ])
  return { total, cars, houses, pending }
}
