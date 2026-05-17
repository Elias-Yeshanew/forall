"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListings = getListings;
exports.getListingById = getListingById;
exports.createListing = createListing;
exports.getListingsAdmin = getListingsAdmin;
exports.getPosterDetails = getPosterDetails;
exports.updateListing = updateListing;
exports.updateListingStatus = updateListingStatus;
exports.deleteListing = deleteListing;
exports.getListingStats = getListingStats;
exports.uploadListingImages = uploadListingImages;
const listing_service_1 = require("../services/listing.service");
const upload_service_1 = require("../services/upload.service");
// ─── PUBLIC ──────────────────────────────────────────────────────────────────
async function getListings(req, res, next) {
    try {
        const filters = {
            type: req.query.type,
            city: req.query.city,
            search: req.query.search,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 12,
        };
        const result = await (0, listing_service_1.getListingsService)(filters);
        res.json({ status: 'success', ...result });
    }
    catch (err) {
        next(err);
    }
}
async function getListingById(req, res, next) {
    try {
        const listing = await (0, listing_service_1.getListingByIdService)(req.params.id);
        res.json({ status: 'success', data: { listing } });
    }
    catch (err) {
        next(err);
    }
}
async function createListing(req, res, next) {
    try {
        const listing = await (0, listing_service_1.createListingService)(req.body);
        res.status(201).json({ status: 'success', data: { listing } });
    }
    catch (err) {
        next(err);
    }
}
// ─── STAFF ONLY ───────────────────────────────────────────────────────────────
async function getListingsAdmin(req, res, next) {
    try {
        const filters = {
            type: req.query.type,
            status: req.query.status,
            city: req.query.city,
            search: req.query.search,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 15,
        };
        const result = await (0, listing_service_1.getListingsAdminService)(filters);
        res.json({ status: 'success', ...result });
    }
    catch (err) {
        next(err);
    }
}
async function getPosterDetails(req, res, next) {
    try {
        const poster = await (0, listing_service_1.getPosterDetailsService)(req.params.id);
        res.json({ status: 'success', data: { poster } });
    }
    catch (err) {
        next(err);
    }
}
async function updateListing(req, res, next) {
    try {
        const listing = await (0, listing_service_1.updateListingService)(req.params.id, req.body);
        res.json({ status: 'success', data: { listing } });
    }
    catch (err) {
        next(err);
    }
}
async function updateListingStatus(req, res, next) {
    try {
        const listing = await (0, listing_service_1.updateListingStatusService)(req.params.id, req.body.status);
        res.json({ status: 'success', data: { listing } });
    }
    catch (err) {
        next(err);
    }
}
async function deleteListing(req, res, next) {
    try {
        await (0, listing_service_1.deleteListingService)(req.params.id);
        res.json({ status: 'success', message: 'Listing deleted successfully' });
    }
    catch (err) {
        next(err);
    }
}
async function getListingStats(req, res, next) {
    try {
        const stats = await (0, listing_service_1.getListingStatsService)();
        res.json({ status: 'success', data: { stats } });
    }
    catch (err) {
        next(err);
    }
}
async function uploadListingImages(req, res, next) {
    try {
        const files = req.files;
        if (!files?.length)
            return res.status(400).json({ status: 'error', message: 'No images provided' });
        const title = typeof req.body?.title === 'string' ? req.body.title : undefined;
        const urls = await (0, upload_service_1.uploadImages)(files, title);
        res.json({ status: 'success', data: { urls } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=listing.controller.js.map