"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/listing.routes.ts
const express_1 = require("express");
const listing_controller_1 = require("../controllers/listing.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const roleGuard_1 = require("../middleware/roleGuard");
const upload_middleware_1 = require("../middleware/upload.middleware");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// ─── Validation schemas ──────────────────────────────────────────────────────
const createSchema = zod_1.z.object({
    type: zod_1.z.enum(['car', 'house']),
    title: zod_1.z.string().min(5).max(120),
    description: zod_1.z.string().min(20).max(2000),
    price: zod_1.z.coerce.number().positive(),
    location: zod_1.z.string().min(3).max(200),
    city: zod_1.z.string().min(2).max(100),
    images: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
    poster: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        phone: zod_1.z.string().min(9).regex(/^\+?[0-9\s\-()]+$/),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    }).optional(),
    carDetails: zod_1.z.object({
        make: zod_1.z.string().min(1),
        model: zod_1.z.string().min(1),
        year: zod_1.z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
        mileage: zod_1.z.coerce.number().min(0),
        transmission: zod_1.z.enum(['automatic', 'manual']),
        fuelType: zod_1.z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
        color: zod_1.z.string().min(1),
        engineSize: zod_1.z.string().optional(),
    }).optional(),
    houseDetails: zod_1.z.object({
        propertyType: zod_1.z.enum(['villa', 'apartment', 'house', 'studio', 'commercial']),
        saleType: zod_1.z.enum(['for_sale', 'for_rent']),
        bedrooms: zod_1.z.coerce.number().min(0),
        bathrooms: zod_1.z.coerce.number().min(0),
        areaSqm: zod_1.z.coerce.number().positive(),
        floor: zod_1.z.coerce.number().optional(),
        furnished: zod_1.z.boolean().default(false),
    }).optional(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'active', 'sold', 'rented']),
});
// ─── PUBLIC routes ───────────────────────────────────────────────────────────
// GET  /api/listings             — browse all active listings (no poster info)
router.get('/', listing_controller_1.getListings);
// GET  /api/listings/stats       — listing counts (public)
router.get('/stats', listing_controller_1.getListingStats);
// ─── STAFF ONLY routes ───────────────────────────────────────────────────────
// GET  /api/listings/admin       — all listings WITH poster info
router.get('/admin', auth_middleware_1.authenticate, roleGuard_1.staffOnly, listing_controller_1.getListingsAdmin);
// GET  /api/listings/:id/poster  — poster contact details (staff only)
router.get('/:id/poster', auth_middleware_1.authenticate, roleGuard_1.staffOnly, listing_controller_1.getPosterDetails);
// GET  /api/listings/:id         — single listing (no poster info)
router.get('/:id', listing_controller_1.getListingById);
// POST /api/listings             — submit new listing (must be logged in)
router.post('/', auth_middleware_1.authenticate, rateLimiter_1.postLimiter, (0, validate_1.validate)(createSchema), listing_controller_1.createListing);
// POST /api/listings/upload      — upload images
router.post('/upload', auth_middleware_1.authenticate, rateLimiter_1.postLimiter, upload_middleware_1.upload.array('images', 8), listing_controller_1.uploadListingImages);
// PUT  /api/listings/:id         — update listing
router.put('/:id', auth_middleware_1.authenticate, roleGuard_1.staffOnly, listing_controller_1.updateListing);
// PATCH /api/listings/:id/status — change status (approve/reject)
router.patch('/:id/status', auth_middleware_1.authenticate, roleGuard_1.staffOnly, (0, validate_1.validate)(updateStatusSchema), listing_controller_1.updateListingStatus);
// DELETE /api/listings/:id       — admin only
router.delete('/:id', auth_middleware_1.authenticate, roleGuard_1.adminOnly, listing_controller_1.deleteListing);
exports.default = router;
//# sourceMappingURL=listing.routes.js.map