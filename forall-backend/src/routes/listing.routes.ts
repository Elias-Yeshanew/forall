// src/routes/listing.routes.ts
import { Router } from 'express'
import {
  getListings, getListingById, createListing,
  getListingsAdmin, getPosterDetails,
  updateListing, updateListingStatus, deleteListing,
  getListingStats, uploadListingImages,
} from '../controllers/listing.controller'
import { authenticate } from '../middleware/auth.middleware'
import { staffOnly, adminOnly } from '../middleware/roleGuard'
import { upload } from '../middleware/upload.middleware'
import { validate } from '../middleware/validate'
import { postLimiter } from '../middleware/rateLimiter'
import { z } from 'zod'

const router = Router()

// ─── Validation schemas ──────────────────────────────────────────────────────
const createSchema = z.object({
  type:        z.enum(['car', 'house']),
  title:       z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  price:       z.coerce.number().positive(),
  location:    z.string().min(3).max(200),
  city:        z.string().min(2).max(100),
  images:      z.array(z.string().url()).optional().default([]),
  poster: z.object({
    fullName: z.string().min(2),
    phone:    z.string().min(9).regex(/^\+?[0-9\s\-()]+$/),
    email:    z.string().email().optional().or(z.literal('')),
  }).optional(),
  carDetails: z.object({
    make:         z.string().min(1),
    model:        z.string().min(1),
    year:         z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
    mileage:      z.coerce.number().min(0),
    transmission: z.enum(['automatic', 'manual']),
    fuelType:     z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
    color:        z.string().min(1),
    engineSize:   z.string().optional(),
  }).optional(),
  houseDetails: z.object({
    propertyType: z.enum(['villa', 'apartment', 'house', 'studio', 'commercial']),
    saleType:     z.enum(['for_sale', 'for_rent']),
    bedrooms:     z.coerce.number().min(0),
    bathrooms:    z.coerce.number().min(0),
    areaSqm:      z.coerce.number().positive(),
    floor:        z.coerce.number().optional(),
    furnished:    z.boolean().default(false),
  }).optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'sold', 'rented']),
})

// ─── PUBLIC routes ───────────────────────────────────────────────────────────
// GET  /api/listings             — browse all active listings (no poster info)
router.get('/', getListings)

// GET  /api/listings/stats       — listing counts (public)
router.get('/stats', getListingStats)

// ─── STAFF ONLY routes ───────────────────────────────────────────────────────
// GET  /api/listings/admin       — all listings WITH poster info
router.get('/admin', authenticate, staffOnly, getListingsAdmin)

// GET  /api/listings/:id/poster  — poster contact details (staff only)
router.get('/:id/poster', authenticate, staffOnly, getPosterDetails)

// GET  /api/listings/:id         — single listing (no poster info)
router.get('/:id', getListingById)

// POST /api/listings             — submit new listing (must be logged in)
router.post('/', authenticate, postLimiter, validate(createSchema), createListing)

// POST /api/listings/upload      — upload images
router.post('/upload', authenticate, postLimiter, upload.array('images', 8), uploadListingImages)

// PUT  /api/listings/:id         — update listing
router.put('/:id', authenticate, staffOnly, updateListing)

// PATCH /api/listings/:id/status — change status (approve/reject)
router.patch('/:id/status', authenticate, staffOnly, validate(updateStatusSchema), updateListingStatus)

// DELETE /api/listings/:id       — admin only
router.delete('/:id', authenticate, adminOnly, deleteListing)

export default router
