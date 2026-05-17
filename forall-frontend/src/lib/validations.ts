// src/lib/validations.ts
import { z } from 'zod'

// ─── Listing ─────────────────────────────────────────────────────────────────

export const carDetailsSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(['automatic', 'manual']),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  color: z.string().min(1, 'Color is required'),
  engineSize: z.string().optional(),
})

export const houseDetailsSchema = z.object({
  propertyType: z.enum(['villa', 'apartment', 'house', 'studio', 'commercial']),
  saleType: z.enum(['for_sale', 'for_rent']),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  areaSqm: z.coerce.number().min(1),
  floor: z.coerce.number().optional(),
  furnished: z.boolean().default(false),
})

export const posterSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z
    .string()
    .min(9, 'Phone number is required')
    .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

export const createListingSchema = z
  .object({
    type: z.enum(['car', 'house']),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(1, 'Price is required'),
    location: z.string().min(3, 'Location is required'),
    city: z.string().min(2, 'City is required'),
    carDetails: carDetailsSchema.optional(),
    houseDetails: houseDetailsSchema.optional(),
    poster: posterSchema,
  })
  .refine(
    (data) => {
      if (data.type === 'car') return !!data.carDetails
      if (data.type === 'house') return !!data.houseDetails
      return true
    },
    { message: 'Please fill in all details for the listing type' }
  )

export type CreateListingFormData = z.infer<typeof createListingSchema>

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z
    .string()
    .min(9, 'Phone number is required')
    .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  listingId: z.string().min(1),
})

export type ContactFormData = z.infer<typeof contactSchema>

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ─── User (Admin) ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'sales']),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
