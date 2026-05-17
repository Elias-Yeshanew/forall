"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueSlug = generateUniqueSlug;
// src/utils/slugify.ts
const slugify_1 = __importDefault(require("slugify"));
const database_1 = require("../config/database");
async function generateUniqueSlug(title) {
    const base = (0, slugify_1.default)(title, { lower: true, strict: true, trim: true });
    let slug = base;
    let count = 1;
    while (true) {
        const existing = await database_1.prisma.listing.findUnique({ where: { slug } });
        if (!existing)
            return slug;
        slug = `${base}-${count++}`;
    }
}
//# sourceMappingURL=slugify.js.map