// src/controllers/listing.controller.ts
import { Request, Response, NextFunction } from 'express'
import {
  getListingsService, getListingsAdminService, getListingByIdService,
  getPosterDetailsService, createListingService, updateListingService,
  updateListingStatusService, deleteListingService, getListingStatsService,
} from '../services/listing.service'
import { uploadImages } from '../services/upload.service'
import { ListingFilters } from '../types/listing'

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

export async function getListings(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: ListingFilters = {
      type:     req.query.type as any,
      city:     req.query.city as string,
      search:   req.query.search as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page:     req.query.page ? Number(req.query.page) : 1,
      limit:    req.query.limit ? Number(req.query.limit) : 12,
    }
    const result = await getListingsService(filters)
    res.json({ status: 'success', ...result })
  } catch (err) { next(err) }
}

export async function getListingById(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await getListingByIdService(req.params.id)
    res.json({ status: 'success', data: { listing } })
  } catch (err) { next(err) }
}

export async function createListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await createListingService(req.body, req.user!.id)
    res.status(201).json({ status: 'success', data: { listing } })
  } catch (err) { next(err) }
}

// ─── STAFF ONLY ───────────────────────────────────────────────────────────────

export async function getListingsAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: ListingFilters = {
      type:     req.query.type as any,
      status:   req.query.status as any,
      city:     req.query.city as string,
      search:   req.query.search as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page:     req.query.page ? Number(req.query.page) : 1,
      limit:    req.query.limit ? Number(req.query.limit) : 15,
    }
    const result = await getListingsAdminService(filters)
    res.json({ status: 'success', ...result })
  } catch (err) { next(err) }
}

export async function getPosterDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const poster = await getPosterDetailsService(req.params.id)
    res.json({ status: 'success', data: { poster } })
  } catch (err) { next(err) }
}

export async function updateListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await updateListingService(req.params.id, req.body)
    res.json({ status: 'success', data: { listing } })
  } catch (err) { next(err) }
}

export async function updateListingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await updateListingStatusService(req.params.id, req.body.status)
    res.json({ status: 'success', data: { listing } })
  } catch (err) { next(err) }
}

export async function deleteListing(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteListingService(req.params.id)
    res.json({ status: 'success', message: 'Listing deleted successfully' })
  } catch (err) { next(err) }
}

export async function getListingStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getListingStatsService()
    res.json({ status: 'success', data: { stats } })
  } catch (err) { next(err) }
}

export async function uploadListingImages(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    if (!files?.length) return res.status(400).json({ status: 'error', message: 'No images provided' })
    const title = typeof req.body?.title === 'string' ? req.body.title : undefined
    const urls = await uploadImages(files, title)
    res.json({ status: 'success', data: { urls } })
  } catch (err) { next(err) }
}
