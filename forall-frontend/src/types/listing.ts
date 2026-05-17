// src/types/listing.ts

export type ListingType = 'car' | 'house'
export type ListingStatus = 'active' | 'pending' | 'sold' | 'rented'

export interface CarDetails {
  make: string
  model: string
  year: number
  mileage: number
  transmission: 'automatic' | 'manual'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  color: string
  engineSize?: string
}

export interface HouseDetails {
  propertyType: 'villa' | 'apartment' | 'house' | 'studio' | 'commercial'
  saleType: 'for_sale' | 'for_rent'
  bedrooms: number
  bathrooms: number
  areaSqm: number
  floor?: number
  furnished: boolean
}

export interface Listing {
  id: string
  type: ListingType
  title: string
  description: string
  price: number
  location: string
  city: string
  status: ListingStatus
  images: string[]
  carDetails?: CarDetails
  houseDetails?: HouseDetails
  createdAt: string
  updatedAt: string
  // Only visible to sales/admin
  poster?: Poster
}

export interface Poster {
  id: string
  fullName: string
  phone: string
  email?: string
  listingId: string
}

export interface ListingFilters {
  type?: ListingType
  search?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  status?: ListingStatus
  page?: number
  limit?: number
}

export interface PaginatedListings {
  data: Listing[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateListingDto {
  type: ListingType
  title: string
  description: string
  price: number
  location: string
  city: string
  carDetails?: Omit<CarDetails, 'id'>
  houseDetails?: Omit<HouseDetails, 'id'>
  poster: {
    fullName: string
    phone: string
    email?: string
  }
  images?: string[]
}
