// src/services/upload.service.ts
import { cloudinary } from '../config/cloudinary'
import { AppError } from '../middleware/errorHandler'
import { env } from '../config/env'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

function toSafeSlug(input?: string): string {
  const raw = (input || 'listing').trim().toLowerCase()
  const slug = raw
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'listing'
}

export async function uploadImages(files: Express.Multer.File[], title?: string): Promise<string[]> {
  if (!files?.length) return []

  if (env.STORAGE_PROVIDER === 'local') {
    const titleSlug = toSafeSlug(title)
    const uploadsDir = path.join(process.cwd(), 'uploads', 'listings')
    await fs.mkdir(uploadsDir, { recursive: true })

    const urls = await Promise.all(
      files.map(async (file, index) => {
        const ext = path.extname(file.originalname) || '.jpg'
        const name = `${titleSlug}-${Date.now()}-${index + 1}-${crypto.randomBytes(4).toString('hex')}${ext}`
        const targetPath = path.join(uploadsDir, name)
        await fs.writeFile(targetPath, file.buffer)
        return `${env.API_BASE_URL}/uploads/listings/${name}`
      })
    )

    return urls
  }

  const uploads = files.map(async (file) => {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'forall/listings',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(new AppError('Image upload failed', 500))
          resolve(result.secure_url)
        }
      )
      stream.end(file.buffer)
    })
  })

  return Promise.all(uploads)
}

export async function deleteImage(publicId: string): Promise<void> {
  if (env.STORAGE_PROVIDER === 'local') return
  await cloudinary.uploader.destroy(publicId)
}
