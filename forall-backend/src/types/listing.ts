// src/types/listing.ts
import {
  ListingType, ListingStatus, Transmission,
  FuelType, PropertyType, SaleType
} from '@prisma/client'

export interface CreateListingDto {
  type: ListingType
  title: string
  description: string
  price: number
  location: string
  city: string
  images?: string[]
  poster: {
    fullName: string
    phone: string
    email?: string
  }
  carDetails?: {
    make: string
    model: string
    year: number
    mileage: number
    transmission: Transmission
    fuelType: FuelType
    color: string
    engineSize?: string
  }
  houseDetails?: {
    propertyType: PropertyType
    saleType: SaleType
    bedrooms: number
    bathrooms: number
    areaSqm: number
    floor?: number
    furnished: boolean
  }
}

export interface UpdateListingDto {
  title?: string
  description?: string
  price?: number
  location?: string
  city?: string
  images?: string[]
  status?: ListingStatus
}

export interface ListingFilters {
  type?: ListingType
  status?: ListingStatus
  city?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
