// src/utils/slugify.ts
import slugifyLib from 'slugify'
import { prisma } from '../config/database'

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugifyLib(title, { lower: true, strict: true, trim: true })
  let slug = base
  let count = 1

  while (true) {
    const existing = await prisma.listing.findUnique({ where: { slug } })
    if (!existing) return slug
    slug = `${base}-${count++}`
  }
}
