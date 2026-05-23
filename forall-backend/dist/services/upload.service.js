"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = uploadImages;
exports.deleteImage = deleteImage;
// src/services/upload.service.ts
const cloudinary_1 = require("../config/cloudinary");
const errorHandler_1 = require("../middleware/errorHandler");
const env_1 = require("../config/env");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function toSafeSlug(input) {
    const raw = (input || 'listing').trim().toLowerCase();
    const slug = raw
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return slug || 'listing';
}
async function uploadImages(files, title) {
    if (!files?.length)
        return [];
    if (env_1.env.STORAGE_PROVIDER === 'local') {
        const titleSlug = toSafeSlug(title);
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads', 'listings');
        await fs_1.promises.mkdir(uploadsDir, { recursive: true });
        const urls = await Promise.all(files.map(async (file, index) => {
            const ext = path_1.default.extname(file.originalname) || '.jpg';
            const name = `${titleSlug}-${Date.now()}-${index + 1}-${crypto_1.default.randomBytes(4).toString('hex')}${ext}`;
            const targetPath = path_1.default.join(uploadsDir, name);
            await fs_1.promises.writeFile(targetPath, file.buffer);
            return `${env_1.env.API_BASE_URL}/uploads/listings/${name}`;
        }));
        return urls;
    }
    const uploads = files.map(async (file) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder: 'forall/listings',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }, (error, result) => {
                if (error || !result)
                    return reject(new errorHandler_1.AppError('Image upload failed', 500));
                resolve(result.secure_url);
            });
            stream.end(file.buffer);
        });
    });
    return Promise.all(uploads);
}
async function deleteImage(publicId) {
    if (env_1.env.STORAGE_PROVIDER === 'local')
        return;
    await cloudinary_1.cloudinary.uploader.destroy(publicId);
}
//# sourceMappingURL=upload.service.js.map