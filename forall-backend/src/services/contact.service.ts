// src/services/contact.service.ts
import { ContactStatus } from '@prisma/client'
import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { getPagination, buildPaginatedResult } from '../utils/pagination'
import { emailService } from './email.service'

export interface CreateContactDto {
  name: string
  phone: string
  email?: string
  message: string
  listingId: string
}

export async function createContactService(dto: CreateContactDto) {
  // Verify listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: dto.listingId },
    select: { id: true, title: true, status: true },
  })
  if (!listing) throw new AppError('Listing not found', 404)
  if (listing.status !== 'active') throw new AppError('This listing is no longer active', 400)

  const contact = await prisma.contact.create({
    data: {
      name:      dto.name,
      phone:     dto.phone,
      email:     dto.email,
      message:   dto.message,
      listingId: dto.listingId,
      status:    'unread',
    },
    include: { listing: { select: { title: true } } },
  })

  // Notify sales team by email (fire and forget)
  emailService.notifySalesTeam({
    customerName:  contact.name,
    customerPhone: contact.phone,
    customerEmail: contact.email,
    message:       contact.message,
    listingTitle:  listing.title,
    listingId:     listing.id,
  }).catch(console.error)

  return contact
}

export async function getContactsService(params: {
  status?: ContactStatus
  page?: number
  limit?: number
}) {
  const { page, limit, skip } = getPagination(params)
  const where = params.status ? { status: params.status } : {}

  const [data, total, unread] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { listing: { select: { title: true, type: true } } },
    }),
    prisma.contact.count({ where }),
    prisma.contact.count({ where: { status: 'unread' } }),
  ])

  return { ...buildPaginatedResult(data, total, page, limit), unread }
}

export async function updateContactService(
  id: string,
  dto: { status: ContactStatus; assignedTo?: string }
) {
  const contact = await prisma.contact.findUnique({ where: { id } })
  if (!contact) throw new AppError('Contact not found', 404)

  return prisma.contact.update({
    where: { id },
    data: dto,
    include: { listing: { select: { title: true } } },
  })
}

export async function getContactStatsService() {
  const [total, unread, replied] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: 'unread' } }),
    prisma.contact.count({ where: { status: 'replied' } }),
  ])
  return { total, unread, replied }
}
