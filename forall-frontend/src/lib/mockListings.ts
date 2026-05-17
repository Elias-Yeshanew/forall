import { Listing, ListingFilters, PaginatedListings } from '@/types/listing'

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-car-1',
    type: 'car',
    title: 'Toyota Land Cruiser Prado 2021',
    description: 'Clean family SUV with full service history and low mileage.',
    price: 9200000,
    location: 'Bole, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80'],
    carDetails: {
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      year: 2021,
      mileage: 38000,
      transmission: 'automatic',
      fuelType: 'diesel',
      color: 'White',
      engineSize: '2.8L',
    },
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-10T12:00:00.000Z',
  },
  {
    id: 'mock-car-2',
    type: 'car',
    title: 'Hyundai Tucson 2020',
    description: 'Well maintained compact SUV, ideal for city and weekend trips.',
    price: 5100000,
    location: 'CMC, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80'],
    carDetails: {
      make: 'Hyundai',
      model: 'Tucson',
      year: 2020,
      mileage: 54000,
      transmission: 'automatic',
      fuelType: 'petrol',
      color: 'Gray',
      engineSize: '2.0L',
    },
    createdAt: '2026-04-02T11:00:00.000Z',
    updatedAt: '2026-04-11T09:00:00.000Z',
  },
  {
    id: 'mock-car-3',
    type: 'car',
    title: 'Suzuki Dzire 2019',
    description: 'Fuel efficient sedan, first owner, great condition.',
    price: 2300000,
    location: 'Megenagna, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80'],
    carDetails: {
      make: 'Suzuki',
      model: 'Dzire',
      year: 2019,
      mileage: 69000,
      transmission: 'manual',
      fuelType: 'petrol',
      color: 'Blue',
      engineSize: '1.2L',
    },
    createdAt: '2026-04-03T14:00:00.000Z',
    updatedAt: '2026-04-09T14:00:00.000Z',
  },
  {
    id: 'mock-house-1',
    type: 'house',
    title: 'Modern 4 Bedroom Villa',
    description: 'Spacious villa with private garden and parking.',
    price: 34000000,
    location: 'Summit, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'],
    houseDetails: {
      propertyType: 'villa',
      saleType: 'for_sale',
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 320,
      furnished: false,
    },
    createdAt: '2026-04-04T08:30:00.000Z',
    updatedAt: '2026-04-10T08:30:00.000Z',
  },
  {
    id: 'mock-house-2',
    type: 'house',
    title: 'Furnished 2 Bedroom Apartment',
    description: 'Move-in ready apartment in a secure compound.',
    price: 125000,
    location: 'Kazanchis, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80'],
    houseDetails: {
      propertyType: 'apartment',
      saleType: 'for_rent',
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 120,
      floor: 6,
      furnished: true,
    },
    createdAt: '2026-04-05T10:45:00.000Z',
    updatedAt: '2026-04-12T10:45:00.000Z',
  },
  {
    id: 'mock-house-3',
    type: 'house',
    title: 'Family House With Compound',
    description: 'Quiet residential neighborhood with large backyard.',
    price: 18500000,
    location: 'Ayat, Addis Ababa',
    city: 'Addis Ababa',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80'],
    houseDetails: {
      propertyType: 'house',
      saleType: 'for_sale',
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 240,
      furnished: false,
    },
    createdAt: '2026-04-06T07:15:00.000Z',
    updatedAt: '2026-04-08T07:15:00.000Z',
  },
]

export function getMockListings(filters: ListingFilters = {}): PaginatedListings {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 12

  let filtered = MOCK_LISTINGS.filter((l) => (filters.type ? l.type === filters.type : true))

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(search) ||
        l.location.toLowerCase().includes(search) ||
        l.city.toLowerCase().includes(search)
    )
  }
  if (filters.city) filtered = filtered.filter((l) => l.city === filters.city)
  if (filters.status) filtered = filtered.filter((l) => l.status === filters.status)
  if (filters.minPrice !== undefined) filtered = filtered.filter((l) => l.price >= filters.minPrice!)
  if (filters.maxPrice !== undefined) filtered = filtered.filter((l) => l.price <= filters.maxPrice!)

  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)
  const total = filtered.length

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}
