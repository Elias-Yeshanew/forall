// src/types/contact.ts

export type ContactStatus = 'unread' | 'read' | 'replied'

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  message: string
  listingId: string
  listingTitle: string
  status: ContactStatus
  createdAt: string
  assignedTo?: string
}

export interface CreateContactDto {
  name: string
  phone: string
  email?: string
  message: string
  listingId: string
}

export interface UpdateContactDto {
  status: ContactStatus
  assignedTo?: string
}
