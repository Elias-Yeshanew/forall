// src/controllers/contact.controller.ts
import { Request, Response, NextFunction } from 'express'
import {
  createContactService, getContactsService,
  updateContactService, getContactStatsService,
} from '../services/contact.service'
import { ContactStatus } from '@prisma/client'

export async function submitContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contact = await createContactService(req.body)
    res.status(201).json({ status: 'success', data: { contact } })
  } catch (err) { next(err) }
}

export async function getContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getContactsService({
      status: req.query.status as ContactStatus | undefined,
      page:   req.query.page ? Number(req.query.page) : 1,
      limit:  req.query.limit ? Number(req.query.limit) : 20,
    })
    res.json({ status: 'success', ...result })
  } catch (err) { next(err) }
}

export async function updateContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contact = await updateContactService(req.params.id, req.body)
    res.json({ status: 'success', data: { contact } })
  } catch (err) { next(err) }
}

export async function getContactStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getContactStatsService()
    res.json({ status: 'success', data: { stats } })
  } catch (err) { next(err) }
}
